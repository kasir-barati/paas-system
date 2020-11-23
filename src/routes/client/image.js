const router = require('express').Router();

const {
    isAuthenticated,
} = require('../../middlewares/jwt');

const {
    middlewareHandler,
} = require('../../utils/promise');

const {
    build,
    baseImagesList,
    uploadProjectZipFile,
} = require('../../controllers/client/image');

// /client/api/v1/images

router.route('/').get(middlewareHandler(baseImagesList));

router
    .route('/upload-zip')
    .all(middlewareHandler(isAuthenticated))
    .post(middlewareHandler(uploadProjectZipFile));

router
    .route('/build')
    .all(middlewareHandler(isAuthenticated))
    .post(middlewareHandler(build));


module.exports = router;