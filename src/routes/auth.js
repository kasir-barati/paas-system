const express = require('express');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');
const { asyncMiddlewareHandler } = require('../utils/promise');

const router = express.Router();

// /api/v1/user/register
router
    .route('/register')
    .post(asyncMiddlewareHandler(authValidator.register), asyncMiddlewareHandler(authController.register));

// /api/v1/user/login
router
    .route('/login')
    .post(asyncMiddlewareHandler(authValidator.login), asyncMiddlewareHandler(authController.login));

// /api/v1/auth/email-verification/
router
    .route('/email-verification')
    .get(asyncMiddlewareHandler(authValidator.emailVerification), asyncMiddlewareHandler(authController.emailVerification));

router
    .route('/password-reset')
    .get(asyncMiddlewareHandler(authValidator.getPasswordReset))
    .post(asyncMiddlewareHandler(authValidator.postPasswordReset));

module.exports = router;