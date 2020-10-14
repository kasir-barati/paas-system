const httpStatus = require('../utils/http-status');

module.exports = (req, res, next) => {
    logger.warn('PageNotFound', {
        meta: {
            "ip": req.ip,
            "method": req.method,
            "originalUrl": req.originalUrl,
            "userAgent": req.get('user-agent'),
        }
    });
    res.json({
        apiStatus: httpStatus.notFound,
        apiData: null,
        apiError: "Page not found"
    });
};