const httpStatus = require('../utils/http-status');
const Logger = require('../utils/logger');
const logger = new Logger('page-not-found');

module.exports = (req, res, next) => {
    logger.warn('PageNotFound', {
        meta: {
            "ip": req.ip,
            "method": req.method,
            "originalUrl": req.originalUrl,
            "userAgent": req.get('user-agent'),
        }
    });
    req.apiStatus = 404;
    req.apiData = null;
    req.apiError = "Page not found";
    next();
};