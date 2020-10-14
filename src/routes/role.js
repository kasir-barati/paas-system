const router = require('express').Router();

const roleController = require('../controllers/role');
const { asyncMiddlewareHandler } = require('../utils/promise');

router
    .route('/')
    .get(asyncMiddlewareHandler(roleController.getRoles))
    .post(asyncMiddlewareHandler(roleController.createRole));

router
    .route('/:id')
    .get(asyncMiddlewareHandler(roleController.getRole))
    .put(asyncMiddlewareHandler(roleController.updateRole))
    .delete(asyncMiddlewareHandler(roleController.deleteRole));

module.exports = router;