const express = require('express');

const profileController = require('../controllers/profile');
const profileValidator = require('../validators/profile');
const { asyncMiddlewareHandler } = require('../utils/promise');

// base URL: /api/v1/user/
const router = express.Router();

router
    .route('/:id')
    .get(asyncMiddlewareHandler(profileController.getProfile))
    .put(asyncMiddlewareHandler(profileValidator.putProfile), asyncMiddlewareHandler(profileController.putProfile))
    .delete(asyncMiddlewareHandler(profileValidator.deleteProfile), asyncMiddlewareHandler(profileController.deleteProfile));

module.exports = router;