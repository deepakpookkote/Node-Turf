
const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = ('/', (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products',
                hadProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
                isAuthenticated: req.session.isLoggedIn
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
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err);
        });
});

exports.getIndex = ((req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
});

exports.getCart = ((req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
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
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log('user',user.cart.items);
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc} };
            });
            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user._id
                },
                products: products
            });
            return order.save()
                .then(result => {
                    return req.user.clearCart();
                })
                .then(() => {
                    res.redirect('/orders');
                })
                .catch(error => console.log(error))
        });
}

exports.getOrders = ((req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                orders: orders,
                pageTitle: 'Your Orders',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(error => console.log(error));
})
