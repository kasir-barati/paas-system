const ErrorResponse = require('../utils/error-response');
const validator = require('../utils/validator');

module.exports.register = async (req, res, next) => {
    let { email, password } = req.body;
    let errorMessage = "";

    !validator.isEmail(email) ? errorMessage = errorMessage.concat("Email isn't valid|") : '';
    !validator.isPassword(password) ? errorMessage = errorMessage.concat("Password isn't valid|") : '';
    
    errorMessage ? next(new ErrorResponse('ValidationError', errorMessage, 400)) : next();
};

module.exports.login = async (req, res, next) => { };

module.exports.emailVerification = async (req, res, next) => { };

module.exports.getPasswordReset = async (req, res, next) => { };
module.exports.postPasswordReset = async (req, res, next) => { };