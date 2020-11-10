const express = require('express');

const authController = require('../../controllers/client/auth');
const authValidator = require('../../validators/client/auth');
const { middlewareHandler } = require('../../utils/promise');

// base URL: /client/api/v1/auth/
const router = express.Router();

router
    .route('/register')
    .post(middlewareHandler(authValidator.register), authController.register);

router
    .route('/login')
    .post(middlewareHandler(authValidator.login), middlewareHandler(authController.login));

router
    .route('/logout')
    .post(middlewareHandler(authValidator.logout), middlewareHandler(authController.logout));

router
    .route('/email-verification')
    .post(middlewareHandler(authValidator.emailVerification), middlewareHandler(authController.emailVerification));

router
    .route('/forgot-password')
    .post(middlewareHandler(authValidator.postPasswordReset), middlewareHandler(authController.postPasswordReset));

router
    .route('/reset-password')
    .put(middlewareHandler(authValidator.putPasswordReset), middlewareHandler(authController.putPasswordReset))

router
    .route('/resend-email-verification')
    .post(middlewareHandler(authValidator.resendEmailVerification), middlewareHandler(authController.resendEmailVerification))

router  
    .route('/check-token')
    .post(middlewareHandler(authValidator.checkToken), middlewareHandler(authController.checkToken));

module.exports = router;