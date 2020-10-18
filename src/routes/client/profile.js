const express = require('express');

const { isUser } = require('../../middlewares/jwt');
const profileController = require('../../controllers/client/profile');
const profileValidator = require('../../validators/profile');
const { asyncMiddlewareHandler } = require('../../utils/promise');

// base URL: /client/api/v1/user/
const router = express.Router();

router
    .route('/:id')
    .get(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(profileController.getProfile))
    .put(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(profileValidator.putProfile), asyncMiddlewareHandler(profileController.putProfile))
    .delete(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(profileValidator.deleteProfile), asyncMiddlewareHandler(profileController.deleteProfile));

module.exports = router;