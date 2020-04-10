
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signUp', authController.getSignUp);
router.post('/login', authController.postLogin);
router.post('/signUp', authController.postSignUp);
router.post('/logout', authController.postLogout);


module.exports = router;