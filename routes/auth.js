
const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signUp', authController.getSignUp);
router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email').normalizeEmail(),
    body('password', 'Please enter a password in alpha numeric and at least 5 characters')
        .isLength({min: 5})
        .isAlphanumeric().trim()
], authController.postLogin);
router.post(
    '/signUp', [
    check('email')
        .isEmail()
        .withMessage('Please Enter a valid email')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email address is forbidden');
            // }
            // return true;
            return User.findOne({ email: value })
                .then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject(
                            'Email already exists enter a different email'
                        );
                    }
                });
        }).normalizeEmail(),
    body('password', 'Please enter a password in alpha numeric and at least 5 characters')
        .isLength({ min: 5 })
        .isAlphanumeric().trim(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password and confirm password is not matching');
            }
            return true;
        }).trim()
], authController.postSignUp
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);


module.exports = router;