const ErrorResponse = require('../../utils/error-response');
const passwordUtil = require('../../utils/password');
const validator = require('../../utils/validator');
const User = require('../../models/user');

module.exports.putProfile = async (req, res, next) => {
    let { userId } = req;
    let user = await User.findByPk(userId);
    let { name, phone, avatar } = req.body;
    let errorMessage = [];

    if (!user) {
        errorMessage.push("Email is duplicated");
    } else {
        !validator.isAlpha(name) ? errorMessage.push("Name isn't valid") : '';
        !validator.isUrl(avatar) ? errorMessage.push("Avatar isn't valid") : '';
        !validator.isNumeric(phone) ? errorMessage.push("Phone isn't valid") : '';
    };
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

// module.exports.deleteProfile = async (req, res, next) => {
//     let errorMessage = [];
//     let { userId } = req;
    
//     !await User.findByPk(userId) ? errorMessage.push("User id is wrong") : '';
//     errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
// };

module.exports.putPasswordReset = async (req, res, next) => {
    let { userId } = req;
    let errorMessage = [];
    let user = await User.findByPk(userId);
    let { newPassword, oldPassword } = req.body;

    if (!await passwordUtil.compare(oldPassword, user.hashedPassword, user.saltPassword)) {
        errorMessage.push("Entered old password is wrong");
    } else {
        !validator.isPassword(newPassword) ? errorMessage.push("New password does not fulfill requirements.") : '';
    };
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};