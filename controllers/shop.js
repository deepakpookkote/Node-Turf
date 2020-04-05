
const Product = require('../models/product');


exports.getProducts = ('/', (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products',
                hadProducts: products.length > 0,
                activeShop: true,
                productCSS: true
            });
        })
        .catch()
});

exports.getProduct = ((req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err);
        });
});

exports.getIndex = ((req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
});

exports.getCart = ((req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(error => {
            console.log(error)
        })
})


exports.postCart = ((req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error)
        })
})

exports.postCartDeleteProduct = ((req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
});

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(error => console.log(error))
}

exports.getOrders = ((req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            console.log(orders,'ttttt')
            res.render('shop/orders', {
                path: '/orders',
                orders: orders,
                pageTitle: 'Your Orders'
            });
        })
        .catch(error => console.log(error));
})
