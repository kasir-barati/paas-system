const ErrorResponse = require('../utils/error-response');
const httpStatus = require('../utils/http-status');
const Logger = require('../utils/logger');

const logger = new Logger('express-error-handler');

const NODE_ENV = process.env.NODE_ENV;

module.exports = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else {
        let error = { 
            name: err.name,
            stack: err.stack,
            message: err.message,
            messages: err.messages,
            statusCode: err.statusCode
        };

        if (error.statusCode >= 400 && error.statusCode <= 422) {
            logger.warn('Validation error occured.', {
                meta: {
                    "ip": req.ip ? req.ip : null,
                    "userAgent": req.get('user-agent'),
                    "method": req.method ? req.method : null,
                    "originalUrl": req.originalUrl ? req.originalUrl : null,
                    "errorName": error.name,
                    "errorStack": error.stack,
                    "errorMessage": error.message,
                }
            });
        } else {
            logger.error('Server side error occured.', {
                meta: {
                    "ip": req.ip ? req.ip : null,
                    "userAgent": req.get('user-agent'),
                    "method": req.method ? req.method : null,
                    "originalUrl": req.originalUrl ? req.originalUrl : null,
                    "errorName": error.name,
                    "errorStack": error.stack,
                    "errorMessage": error.message,
                }
            });
        };

        // if error thrown because of database goes down you must send email to the admin
        switch (err.name) {
            case 'Error':
            case 'TypeError':
            case 'ReferenceError':
                error = new ErrorResponse('ProgramingExeption', `Some kind of mistake happened in backend, please report it to the admin.`, 500);
                break;
            case 'AssertionError':
            case 'MongoParseError':
            case 'MongoServerSelectionError':
            case 'SequelizeConnectionError':
            case 'SequelizeConnectionRefusedError':
                error = new ErrorResponse('DatabaseError', `Some kind of mistake happened in backend, please report it to the admin.`, 500);
                await mail.sendMail('admin <ADMIN@GMAIL.COM>', 'node.js.developers.kh@gmail.com', 'Your database goes down', '<h1>please go there</h1>');
                break;
            case 'jwtError':
            case 'TokenExpiredError': 
            case 'JsonWebTokenError': 
            case 'NotBeforeError': 
                error = new ErrorResponse('jwtError', `JWT error occured.`, 401);
                break;
            case 'Unauthorized':
                error = new ErrorResponse('Unauthorized', `JWT error occured.`, 403);
                break;
            case 'PaymentFailed': 
                error.message = `Payment failed. please retry again.`;
                break;
        };

        if (error.statusCode === 401) {
            res.status(401).json({
                apiStatus: httpStatus[error.statusCode],
                apiData: null,
                apiError: NODE_ENV === 'developement' ? err.message : error.message
            });
        } else {
            res.status(200).json({
                apiStatus: httpStatus[error.statusCode],
                apiData: null,
                apiError: NODE_ENV === 'developement' ? err.message : error.message
            });
        };
    };
};