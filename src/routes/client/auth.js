const express = require('express');

const {
    login,
    logout,
    register,
    checkToken,
    forgotPassword,
    putPasswordReset,
    emailVerification,
    resendEmailVerification,
} = require('../../controllers/client/auth');
const authValidator = require('../../validators/client/auth');
const {
    middlewareHandler,
} = require('../../utils/promise');

// base URL: /client/api/v1/auth/
const router = express.Router();

router
    .route('/register')
    .post(
        middlewareHandler(authValidator.register),
        middlewareHandler(register),
    );

router
    .route('/login')
    .post(
        middlewareHandler(authValidator.login),
        middlewareHandler(login),
    );

router
    .route('/logout')
    .post(
        middlewareHandler(authValidator.logout),
        middlewareHandler(logout),
    );

router
    .route('/email-verification')
    .post(
        middlewareHandler(authValidator.emailVerification),
        middlewareHandler(emailVerification),
    );

router
    .route('/resend-email-verification')
    .post(
        middlewareHandler(
            authValidator.resendEmailVerification,
        ),
        middlewareHandler(resendEmailVerification),
    );

router
    .route('/forgot-password')
    .post(
        middlewareHandler(authValidator.forgotPassword),
        middlewareHandler(forgotPassword),
    );

router
    .route('/reset-password')
    .put(
        middlewareHandler(authValidator.putPasswordReset),
        middlewareHandler(putPasswordReset),
    );

router
    .route('/check-token')
    .post(
        middlewareHandler(checkToken),
    );

module.exports = router;
