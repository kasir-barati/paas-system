const httpStatus = require('../utils/http-status');

module.exports = (req, res) => {
    let resObject = {
        apiStatus: '',
        apiData: [],
        apiError: null
    };
    switch (req.status) {
        case 200:
        case 201:
            resObject.status = httpStatus.OK;
            resObject.data = req.data;
            resObject.error = req.error;
            break;
        case 400:
            resObject.status = httpStatus.badReqeust;
            resObject.data = req.data;
            resObject.error = req.error;
            break;
        default: 
            resObject.status = httpStatus.serverSideError;
            resObject.data = req.data;
            resObject.error = req.error;
            break;
    };

    res.json(resObject);
};