const User = require('../models/user');

exports.getLogin = ((req, res, next) => {
    //const isLoggedIn =  req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
});

exports.postLogin = ((req, res, next) => {
    User.findById('5e8b27368424bb12334cb4e2')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(error => {
            console.log('User not exist');
        });
})

exports.postLogout = ((req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    });
})
