const path = require('path');
const express = require('express');

const rootDir = require('../helpers/path');


const router = express.Router();

const products = [];

//GET
router.get('/add-product', (req, res, next) => {
   // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
})

//POST
router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    console.log(req.body, 'test');
    res.redirect('/');
})


exports.routes = router;
exports.products = products;
