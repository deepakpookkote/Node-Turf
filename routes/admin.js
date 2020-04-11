
const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');
const router = express.Router();

//GET
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', adminController.getProducts);
//POST
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 3, max: 250 })
        .trim()
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 3, max: 250 })
        .trim()
], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;





