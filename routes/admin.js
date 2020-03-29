const path = require('path');
const express = require('express');

const productsController = require('../controllers/product');

const router = express.Router();

//GET
router.get('/add-product', productsController.getAddProduct);
//POST
router.post('/add-product', productsController.postAddProducts);

module.exports = router;
