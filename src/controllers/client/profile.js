const User = require('../../models/user');
const passwordUtil = require('../../utils/password');

module.exports.getProfile = async (req, res, next) => {
    let { user } = req;
    let profile = await User.findByPk(user.id);

    req.apiData = {
        user: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar,
        balance: profile.balance,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
    };
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.updateProfile = async (req, res, next) => {
    let { id } = req.user;
    let { name, phone, avatar } = req.body;
    
    await User.update({
        name, phone, avatar
    }, {
        where: { 
            id: id
        }
    });

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.updatePassword = async (req, res, next) => {
    let { id } = req.user;
    let { newPassword } = req.body;
    let { hashedPassword, salt } = await passwordUtil.hashPassword(newPassword);
    
    await User.update({
        hashedPassword, saltPassword: salt
    }, {
        where: {
            id: id
        }
    });

    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};