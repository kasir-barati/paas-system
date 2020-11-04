const Logger = require('../utils/logger');
const logger = new Logger('middleware-logger');

module.exports = (req, res, next) => {
    logger.info('middleware logging', {
        meta: {
            "ip": req.ip,
            "body": req.body,
            "method": req.method,
            "headers": req.headers,
            "originalUrl": req.originalUrl
        }
    });
    next();
};