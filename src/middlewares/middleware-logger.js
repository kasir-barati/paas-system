const Logger = require('../utils/logger');
const logger = new Logger('middleware-logger');

module.exports = (req, res, next) => {
    logger.info('middleware logging', {
        meta: {
            "ip": req.ip ? req.ip : null,
            "userAgent": req.get('user-agent'),
            "headers": req.headers,
            "method": req.method ? req.method : null,
            "body": req.body,
            "originalUrl": req.originalUrl ? req.originalUrl : null
        }
    });
    next();
};