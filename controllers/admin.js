const Product = require('../models/product');
//GET
exports.getAddProduct = ('/edit-product', (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
});

exports.postAddProduct = ('/add-product', (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save()
        .then(result => {
            console.log('Product Added');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        })
});

exports.getEditProduct = ('/edit-product', (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(error => {
            console.log(error)
        })
});

exports.postEditProduct = ((req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description;

    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId, req.user._id);
    return product.save()
        .then(result => {
            console.log('product updated')
            res.redirect('/admin/products');
        })
        .catch(error => console.log('error', error));
});

exports.getProducts = ((req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch()
});

exports.postDeleteProduct = ((req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(product => {
            console.log('Removed Product');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
});
