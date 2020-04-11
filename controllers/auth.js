const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator');

const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = ((req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: []
    });
});

exports.getSignUp = ((req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signUp',
        pageTitle: 'Register',
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
});

exports.postLogin = ((req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array()
        });
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid username or Password',
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid username or Password',
                        oldInput: {
                            email: email,
                            password: password,
                        },
                        validationErrors: []
                    });
                })
                .catch(error => res.redirect('/login'));

        })
        .catch(error => {
            console.log('User not exist');
        });
})

exports.postSignUp = ((req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            path: '/signUp',
            pageTitle: 'SignUp',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }
    return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });
        return user.save();
    })
    .then(result => {
        res.redirect('login');
        return transporter.sendMail({
            to: email,
            from: 'pookkotedeepak@gmail.com',
            subject: 'Signup Success',
            html: '<h1>Registration completed successfully!!</h1>'
        })
    })
    .catch(error => {
        console.log('error', error);
    });
});

exports.postLogout = ((req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    });
});

exports.getReset = ((req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
});

exports.postReset = ((req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'Email id not exist');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'pookkotedeepak@gmail.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You have requested for password reset</p>
                        <p>click this link to reset your password <a href="http://localhost:3030/reset/${token}">link</a></p>
                        `
                })
            })
            .catch(error => {
                console.log('error', error);
            });
    })
});


exports.getNewPassword = ((req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0]
            } else {
                message = null
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                passwordToken: token,
                userId: user._id.toString()
            });
        })
        .catch(error => {
            console.log('error', error);
        });
});

exports.postNewPassword = ((req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {
            $gt: Date.now(),
        },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(error => {
            console.log('error', error);
        });
})
