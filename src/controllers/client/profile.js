const User = require('../../models/user');
const passwordUtil = require('../../utils/password');

module.exports.getProfile = async (req, res, next) => {
    let { userId } = req;
    let user = await User.findByPk(userId);

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
    let { userId } = req;
    let { name, phone, avatar } = req.body;
    
    await User.update({
        name, phone, avatar
    }, {
        where: { 
            id: userId
        }
    });

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

// module.exports.deleteProfile = async (req, res, next) => {
//     let { userId } = req;

//     await User.update({
//         isDeleted: true
//     }, {
//         where: {
//             id: userId
//         }
//     });

//     req.apiData = null;
//     req.apiError = null;
//     req.apiStatus = 200;
//     next();
// };

module.exports.putPasswordReset = async (req, res, next) => {
    let { userId } = req;
    let { newPassword } = req.body;
    let { hashedPassword, salt } = await passwordUtil.hashPassword(newPassword);
    
    await User.update({
        hashedPassword, saltPassword: salt
    }, {
        where: {
            id: userId
        }
    });

    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};