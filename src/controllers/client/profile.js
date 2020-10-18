const User = require('../../models/user');

module.exports.getProfile = async (req, res, next) => {
    let { id } = req.body;
    let user = await User.findByPk(id);

    req.apiData = user;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.putProfile = async (req, res, next) => {
    let { id } = req.body;
    let { name, email, phone, avatar, balance } = req.body;
    
    await User.update({
        name, email, phone, avatar, balance
    }, {
        where: {
            id
        }
    });
    req.apiData = user;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.deleteProfile = async (req, res, next) => {
    let { id } = req.body;

    await User.update({
        isDeleted: true
    }, {
        where: {
            id
        }
    });
    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};