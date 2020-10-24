module.exports = (req, res) => {
    res.json({
        apiData: req.apiData,
        apiError: req.apiError,
        apiStatus: req.apiStatus
    });
};