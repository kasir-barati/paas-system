const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { asyncMiddlewareHandler } = require('../../utils/promise');
const databaseValidator = require('../../validators/client/database');
const databaseController = require('../../controllers/client/database');

// /client/api/v1/databases
router
    .route('/')
    .all(asyncMiddlewareHandler(isUser))
    .post(asyncMiddlewareHandler(databaseValidator.createDatabaseService), databaseController.createDatabaseService)
    .get(asyncMiddlewareHandler(databaseValidator.getProjects), asyncMiddlewareHandler(databaseController.getProjects))
    .put(asyncMiddlewareHandler(databaseValidator.putProject), asyncMiddlewareHandler(databaseController.putProject))
    .delete(asyncMiddlewareHandler(databaseValidator.deleteProject), asyncMiddlewareHandler(databaseController.deleteProject));

// router
//     .route('/')
//     .all(asyncMiddlewareHandler(isUser))

module.exports = router;