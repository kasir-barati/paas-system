const express = require('express');

const { isUser } = require('../../middlewares/jwt');
const { asyncMiddlewareHandler } = require('../../utils/promise');
const profileValidator = require('../../validators/client/profile');
const profileController = require('../../controllers/client/profile');

// base URL: /client/api/v1/profiles/
const router = express.Router();

router
    .route('/:id')
    .get(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(profileController.getProfile))
    .put(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(profileValidator.putProfile), asyncMiddlewareHandler(profileController.putProfile))
    .delete(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(profileValidator.deleteProfile), asyncMiddlewareHandler(profileController.deleteProfile));

module.exports = router;