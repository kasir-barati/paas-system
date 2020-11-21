const router = require('express').Router();

const {
    baseImagesList,
    uploadProjectZipFile,
} = require('../../controllers/client/image');

// /client/api/v1/images

router.route('/').get(middlewareHandler(baseImagesList));

router
    .route('/upload-zip')
    .all(middlewareHandler(isUser))
    .post(middlewareHandler(uploadProjectZipFile));
