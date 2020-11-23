const express = require('express');

const {
    isAuthenticated,
} = require('../../middlewares/jwt');
const {
    middlewareHandler,
} = require('../../utils/promise');
const profileValidator = require('../../validators/client/profile');
const profileController = require('../../controllers/client/profile');

// base URL: /client/api/v1/profiles/
const router = express.Router();

router
    .route('/')
    .all(middlewareHandler(isAuthenticated))
    .get(middlewareHandler(profileController.getProfile))
    .put(
        middlewareHandler(profileValidator.updateProfile),
        middlewareHandler(profileController.putProfile),
    );

router
    .route('/reset-password')
    .all(middlewareHandler(isAuthenticated))
    .put(
        middlewareHandler(profileValidator.updatePassword),
        middlewareHandler(
            profileController.putPasswordReset,
        ),
    );

module.exports = router;
