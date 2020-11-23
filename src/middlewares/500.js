const ErrorResponse = require('../utils/error-response');
const Logger = require('../utils/logger');

const logger = new Logger('express-error-handler');

const NODE_ENV = process.env.NODE_ENV;

module.exports = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else {
        let error = {
            name: err?.name ?? 'Undefined error name',
            message:
                err?.message ?? 'undefined error message',
            statusCode: err?.statusCode ?? 500,
        };
        let meta = {
            ip: req.ip,
            error: err,
            body: req.body,
            method: req.method,
            headers: req.headers,
            originalUrl: req.originalUrl,
        };

        // if error thrown because of database goes down you must send email to the admin
        switch (err.name) {
            case 'ValidationError':
                error.statusCode = 200;
                break;
            case 'Error':
            case 'TypeError':
            case 'DockerError':
            case 'SyntaxError':
            case 'ReferenceError':
            case 'AssertionError':
            case 'MongoParseError':
            case 'SequelizeDatabaseError':
            case 'SequelizeConnectionError':
            case 'MongoServerSelectionError':
            case 'SequelizeUniqueConstraintError':
            case 'SequelizeConnectionRefusedError':
            case 'SequelizeForeignKeyConstraintError:':
                error.message = 'SERVER_ERROR';
                error.statusCode = 200;
                // await mail.sendMail(
                //     'noreply@talashnet.info',
                //     'node.js.developers.kh@gmail.com',
                //     'You have a serious problem',
                //     '<h1>please go there & fix it</h1>',
                // );
                break;
            case 'jwtError':
            case 'NotBeforeError':
            case 'TokenExpiredError':
            case 'JsonWebTokenError':
            case 'AuthenticationError':
                error.message = `Wrong access token.`;
                error.statusCode = 401;
                break;
            case 'PaymentFailed':
                error.message = `Payment failed. please retry again.`;
                break;
        }

        if (
            err.statusCode >= 400 &&
            err.statusCode <= 422
        ) {
            logger.warn('Validation error occured.', {
                meta,
            });
        } else {
            logger.error('Server side error occured.', {
                meta,
            });
        }
        res.status(error?.statusCode ?? 200).json({
            apiData: null,
            apiStatus: err?.statusCode ?? 500,
            apiError:
                NODE_ENV === 'developement'
                    ? err.message
                    : error.message,
        });
    }
};
