const ErrorResponse = require('../utils/error-response');
const passwordUtil = require('../utils/password');
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

module.exports.login = async (req, res, next) => {
    let errorMessage = [];
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });

    if (!user) {
        errorMessage.push("Email/Password is wrong");
    } else {
        !await passwordUtil.compare(password, user.hashedPassword, user.saltPassword) ? errorMessage.push("Email/Password is wrong") : '';
    };
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.emailVerification = async (req, res, next) => {
    let { token } = req.body;
    let errorMessage = [];

    !await Token.findOne({ token }) ? errorMessage.push('Token does not exist') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.resendEmailVerification = async (req, res, next) => {
    let { email } = req.body;
    let errorMessage = [];
    
    !await User.findOne({ where: { email } }) ? errorMessage.push('Email is wrong') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.logout = async (req, res, next) => {
    let { accessToken } = req.body;
    let errorMessage = [];

    !await Token.findOne({ token: accessToken }) ? errorMessage.push('AccessToken is not valid') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.postPasswordReset = async (req, res, next) => { 
    let { email } = req.body;
    let user = await User.findOne({
        where: {
            email
        }
    });
    let errorMessage = [];
    console.log(user.emailVerified);
    !user ? errorMessage.push('Email is wrong.') : '';
    !user.emailVerified ? errorMessage.push('This email is not verified.') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.putPasswordReset = async (req, res, next) => { 
    let { token, password } = req.body;
    let errorMessage = [];

    !validator.isPassword(password) ? errorMessage.push("Password isn't valid.") : '';
    !await Token.findOne({ token }) ? errorMessage.push('Token does not exist.') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};