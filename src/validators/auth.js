const ErrorResponse = require('../utils/error-response');
const validator = require('../utils/validator');
const Token = require('../models/token');
const User = require('../models/user');

module.exports.register = async (req, res, next) => {
    let { email, password } = req.body;
    let user = await User.findOne({
        where: {
            email
        }
    });
    let errorMessage = [];

    user ? errorMessage.push("Email is duplicated") : '';
    !validator.isEmail(email) ? errorMessage.push("Email isn't valid") : '';
    !validator.isPassword(password) ? errorMessage.push("Password isn't valid") : '';

    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.login = async (req, res, next) => { };

module.exports.emailVerification = async (req, res, next) => {
    let { token } = req.body;
    let errorMessage = [];

    !await Token.findOne({ token: { token } }) ? errorMessage.push('Token does not exist') : '';

    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.getPasswordReset = async (req, res, next) => { };
module.exports.postPasswordReset = async (req, res, next) => { };