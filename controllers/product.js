
const Product = require('../models/product');

//GET
exports.getAddProduct = ('/add-product', (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formCSS: true,
        activeAddProduct: true,
        productCSS: true
    });
});

exports.postAddProducts = ('/add-product', (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
})

exports.getProducts = ('/', (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hadProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    }));

})