const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

//GET
router.get('/add-product', adminController.getAddProduct);
//POST
router.post('/add-product', adminController.postAddProducts);

router.get('/products',  adminController.getProducts);

module.exports = router;
