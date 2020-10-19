const router = require('express').Router();

const userController = require('../../controllers/user');
const { asyncMiddlewareHandler } = require('../../utils/promise');

router
    .route('/')
    .get(asyncMiddlewareHandler(userController.getUsers))
    .post(asyncMiddlewareHandler(userController.createUser));

router
    .route('/:id')
    .get(asyncMiddlewareHandler(userController.getUser))
    .put(asyncMiddlewareHandler(userController.updateUser))
    .delete(asyncMiddlewareHandler(userController.deleteUser));

module.exports = router;
