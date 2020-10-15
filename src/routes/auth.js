const express = require('express');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');
const { asyncMiddlewareHandler } = require('../utils/promise');

// base URL: /api/v1/user/
const router = express.Router();

router
    .route('/register')
    .post(asyncMiddlewareHandler(authValidator.register), asyncMiddlewareHandler(authController.register));

router
    .route('/login')
    .post(asyncMiddlewareHandler(authValidator.login), asyncMiddlewareHandler(authController.login));

router
    .route('/logout')
    .post(asyncMiddlewareHandler(authValidator.logout), asyncMiddlewareHandler(authController.logout));

router
    .route('/email-verification')
    .post(asyncMiddlewareHandler(authValidator.emailVerification), asyncMiddlewareHandler(authController.emailVerification));

router
    .route('/password-reset')
    .put(asyncMiddlewareHandler(authValidator.putPasswordReset), asyncMiddlewareHandler(authController.putPasswordReset))
    .post(asyncMiddlewareHandler(authValidator.postPasswordReset), asyncMiddlewareHandler(authController.postPasswordReset));

router
    .route('/resend-email-verification')
    .post(asyncMiddlewareHandler(authValidator.resendEmailVerification), asyncMiddlewareHandler(authController.resendEmailVerification))

module.exports = router;