const ErrorResponse = require('../../utils/error-response');
const passwordUtil = require('../../utils/password');
const validator = require('../../utils/validator');
const Token = require('../../models/token');
const User = require('../../models/user');

class LogoutError extends ErrorResponse {
    constructor(message) {
        super('ValidationError', message, 400);
    }
}

class RegisterError extends ErrorResponse {
    constructor(message) {
        super('VerificationError', message, 400);
    }
}

class LoginError extends ErrorResponse {
    constructor(message) {
        super('ValidationError', message, 400);
    }
}

class EmailVerificationError extends ErrorResponse {
    constructor(message) {
        super('ValidationError', message, 400);
    }
}

class ResendEmailVerificationError extends ErrorResponse {
    constructor(message) {
        super('ValidationError', message, 400);
    }
}

module.exports.register = async (req, res, next) => {
    let errorMessage = [];
    let { email, password } = req.body;

    if (!validator.isEmail(email)) {
        errorMessage.push("Email isn't valid");
    } else {
        let user = await User.findOne({
            where: {
                email,
            },
        });
        user
            ? errorMessage.push('Email is duplicated')
            : '';
    }
    !validator.isPassword(password)
        ? errorMessage.push("Password isn't valid")
        : '';
    errorMessage.length
        ? next(new RegisterError(errorMessage.join('|')))
        : next();
};

module.exports.login = async (req, res, next) => {
    let errorMessage = [];
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });

    if (!user) {
        errorMessage.push('Wrong Email/Password.');
    } else {
        !(await passwordUtil.compare(
            password,
            user.hashedPassword,
            user.saltPassword,
        ))
            ? errorMessage.push('Email/Password is wrong')
            : '';
    }
    errorMessage.length
        ? next(new LoginError(errorMessage.join('|')))
        : next();
};

module.exports.emailVerification = async (
    req,
    res,
    next,
) => {
    let { token } = req.body;
    let errorMessage = [];

    !(await Token.findOne({ token }))
        ? errorMessage.push('Token does not exist')
        : '';
    errorMessage.length
        ? next(
              new EmailVerificationError(
                  errorMessage.join('|'),
              ),
          )
        : next();
};

module.exports.resendEmailVerification = async (
    req,
    res,
    next,
) => {
    let { email } = req.body;
    let errorMessage = [];

    !(await User.findOne({ where: { email } }))
        ? errorMessage.push('Wrong email entered.')
        : '';
    errorMessage.length
        ? next(
              new ResendEmailVerificationError(
                  errorMessage.join('|'),
              ),
          )
        : next();
};

module.exports.logout = async (req, res, next) => {
    let { accessToken } = req.body;
    let errorMessage = [];

    !(await Token.findOne({ token: accessToken }))
        ? errorMessage.push('AccessToken is not valid')
        : '';
    errorMessage.length
        ? next(new LogoutError(errorMessage.join('|')))
        : next();
};

module.exports.forgotPassword = async (
    req,
    res,
    next,
) => {
    let { email } = req.body;
    let user = await User.findOne({
        where: {
            email,
        },
    });
    let errorMessage = [];

    !user ? errorMessage.push('Email is wrong.') : '';
    !user.emailVerified
        ? errorMessage.push('This email is not verified.')
        : '';
    errorMessage.length
        ? next(
              new ErrorResponse(
                  'ValidationError',
                  errorMessage.join('|'),
                  400,
              ),
          )
        : next();
};

module.exports.putPasswordReset = async (
    req,
    res,
    next,
) => {
    let { token, password } = req.body;
    let errorMessage = [];

    !validator.isPassword(password)
        ? errorMessage.push("Password isn't valid.")
        : '';
    !(await Token.findOne({ token }))
        ? errorMessage.push('Wrong token')
        : '';
    errorMessage.length
        ? next(
              new ErrorResponse(
                  'ValidationError',
                  errorMessage.join('|'),
                  400,
              ),
          )
        : next();
};
