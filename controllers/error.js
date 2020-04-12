exports.get404Page = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found!!',
        sAuthenticated: req.session.isLoggedIn,
        path: ''});
};

exports.get500Page = (req, res, next) => {
    res.status(404).render('500', {
        pageTitle: 'Internal Server Error!!',
        sAuthenticated: req.session.isLoggedIn,
        path: '/500'});
};