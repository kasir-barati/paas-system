const httpStatus = require('../utils/http-status');

module.exports = (req, res) => {
    res.json({
        apiData: req.apiData,
        apiError: req.apiError,
        apiStatus: httpStatus[req.apiStatus]
    });
};