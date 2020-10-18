const ErrorResponse = require('../utils/error-response');
const validator = require('../utils/validator');
const User = require('../models/user');

module.exports.putProfile = async (req, res, next) => {
    let { id } = req.params;
    let user = await User.findByPk(id);
    let { name, email, phone, avatar, balance } = req.body;
    let errorMessage = [];

    if (!user) {
        errorMessage.push("Email is duplicated");
    } else {
        !validator.isAlpha(name) ? errorMessage.push("Name isn't valid") : '';
        !validator.isUrl(avatar) ? errorMessage.push("Avatar isn't valid") : '';
        !validator.isEmail(email) ? errorMessage.push("Email isn't valid") : '';
        !validator.isNumeric(phone) ? errorMessage.push("Phone isn't valid") : '';
        !validator.isNumeric(balance) ? errorMessage.push("Balance isn't valid") : '';
    };
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.deleteProfile = async (req, res, next) => {
    let errorMessage = [];
    let { id } = req.params;
    
    await User.findByPk(id) ? errorMessage.push("User id is wrong") : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};