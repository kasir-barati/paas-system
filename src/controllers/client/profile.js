const User = require('../../models/user');

module.exports.getProfile = async (req, res, next) => {
    let { id } = req.params;
    let user = await User.findByPk(id);

    req.apiData = {
        user: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        balance: user.balance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.putProfile = async (req, res, next) => {
    let { id } = req.params;
    let { name, phone, avatar } = req.body;
    
    await User.update({
        name, phone, avatar
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

module.exports.deleteProfile = async (req, res, next) => {
    let { id } = req.params;

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