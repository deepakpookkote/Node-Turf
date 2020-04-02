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
    req.user
        .createProduct({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
        })
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
    req.user.getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0];
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
    // Product.findByPk(prodId)
    //     .then(product => {
    //         if (!product) {
    //             res.redirect('/');
    //         }
    //         res.render('admin/edit-product', {
    //             pageTitle: 'Edit Product',
    //             path: '/admin/edit-product',
    //             editing: editMode,
    //             product: product
    //         });
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })
});

exports.postEditProduct = ((req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description;

    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save()
        })
        .then(result => {
            console.log('Product details updated');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        })
});

exports.getProducts = ((req, res, next) => {
    req.user.getProducts()
        // Product.findAll()
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
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Removed Product');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
});
