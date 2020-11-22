const ErrorResponse = require('../utils/error-response');
const Logger = require('../utils/logger');

const logger = new Logger('express-error-handler');

const NODE_ENV = process.env.NODE_ENV;

module.exports = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else {
        let error;
        let meta = {
            "ip": req.ip,
            "body": req.body,
            "method": req.method,
            "headers": req.headers,
            "originalUrl": req.originalUrl,
            "errorName": err.name,
            "errorStack": err.stack,
            "errorMessage": err.message,
        };

        // if error thrown because of database goes down you must send email to the admin
        switch (err.name) {
            case 'ValidationError': 
                error = new ErrorResponse('ValidationError', err.message, 400);;
                break;
            case 'DockerError':
                error = new ErrorResponse('DockerError', 'Docker could not handle request correctly', 500);;
                break;
            case 'Error':
            case 'TypeError':
            case 'ReferenceError':
                error = new ErrorResponse('ProgramingExeption', `Some kind of mistake happened in backend, please report it to the admin.`, 500);
                break;
            case 'SequelizeDatabaseError':
                meta.sequelizeErrors = [];
                meta.sequelizeErrors.push(meta.errorMessage);
                break;
            case 'AssertionError':
            case 'MongoParseError':
            case 'SequelizeConnectionError':
            case 'MongoServerSelectionError':
            case 'SequelizeUniqueConstraintError':
            case 'SequelizeConnectionRefusedError':
            case 'SequelizeForeignKeyConstraintError:':
                meta.sequelizeErrors = [];
                for (let item of err.errors) {
                    meta.sequelizeErrors.push({
                        type: item.type,
                        value: item.value,
                        message: item.message
                    });
                };
                error = new ErrorResponse('DatabaseError', `Some kind of mistake happened in backend, please report it to the admin.`, 500);
                await mail.sendMail('admin <ADMIN@GMAIL.COM>', 'node.js.developers.kh@gmail.com', 'Your database goes down', '<h1>please go there</h1>');
                break;
            case 'jwtError':
            case 'TokenExpiredError': 
            case 'JsonWebTokenError': 
            case 'NotBeforeError': 
                error = new ErrorResponse('jwtError', `Wrong access token.`, 401);
                break;
            case 'Unauthorized':
                error = new ErrorResponse('Unauthorized', `Wrong access token.`, 401);
                break;
            case 'PaymentFailed': 
                error.message = `Payment failed. please retry again.`;
                break;
            case 'SyntaxError': 
                error = new ErrorResponse('badRequest', `Something sent wrong.`, 400);
                break;
        };

        if (err.statusCode >= 400 && err.statusCode <= 422) {
            logger.warn('Validation error occured.', { meta });
        } else {
            logger.error('Server side error occured.', { meta });
        };
        res.status(err.statusCode === 401 ? 401 : 200).json({
            apiData: null,
            apiStatus: error.statusCode,
            apiError: NODE_ENV === 'developement' ? err.message : error.message
        });
    };
};