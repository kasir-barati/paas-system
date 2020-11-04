const express = require('express');

const { isUser } = require('../../middlewares/jwt');
const { middlewareHandler } = require('../../utils/promise');
const profileValidator = require('../../validators/client/profile');
const profileController = require('../../controllers/client/profile');

// base URL: /client/api/v1/profiles/
const router = express.Router();

router
    .route('/')
    .all(middlewareHandler(isUser))
    .get(middlewareHandler(profileController.getProfile))
    .put(middlewareHandler(profileValidator.putProfile), middlewareHandler(profileController.putProfile))
    // .delete(middlewareHandler(profileValidator.deleteProfile), middlewareHandler(profileController.deleteProfile));

router
    .route('/reset-password')
    .all(middlewareHandler(isUser))
    .put(middlewareHandler(profileValidator.putPasswordReset), middlewareHandler(profileController.putPasswordReset));

module.exports = router;