const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = ((req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
});

exports.getSignUp = ((req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signUp',
        pageTitle: 'Register',
        errorMessage: message
    });
});

exports.postLogin = ((req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
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
                    req.flash('error', 'Invalid email or password');
                    res.redirect('login');
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
    User.findOne({ email: email })
        .then((userDoc) => {
            console.log(userDoc);
            if (userDoc) {
                console.log('user exist');
                req.flash('error', 'Email id already exist');
                return res.redirect('/signUp');
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
                    res.redirect('/login');
                });
        })
        .catch(error => {
            console.log('creation error');
        });
});

exports.postLogout = ((req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    });
})
