const express = require('express');

const authController = require('../../controllers/client/auth');
const authValidator = require('../../validators/client/auth');
const { asyncMiddlewareHandler } = require('../../utils/promise');

// base URL: /client/api/v1/auth/
const router = express.Router();

router
    .route('/register')
    .post(asyncMiddlewareHandler(authValidator.register), authController.register);

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