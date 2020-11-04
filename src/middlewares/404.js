const Logger = require('../utils/logger');
const logger = new Logger('page-not-found');

module.exports = (req, res, next) => {
    if (!req.apiStatus) {
        logger.warn('PageNotFound', {
            meta: {
                "ip": req.ip,
                "body": req.body,
                "method": req.method,
                "headers": req.headers,
                "originalUrl": req.originalUrl,
            }
        });
        req.apiStatus = 404;
        req.apiData = null;
        req.apiError = "Page not found";
    };
    next();
};