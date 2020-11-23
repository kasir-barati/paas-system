// const path = require('path');
const crypto = require('crypto');
// const { promises: fsPromises } = require('fs');

const jwt = require('../../utils/jwt');
const mail = require('../../utils/mail');
const Role = require('../../models/role');
const User = require('../../models/user');
const Token = require('../../models/token');
const authService = require('../../services/auth');
const passwordUtil = require('../../utils/password');
const { promiseHandler } = require('../../utils/promise');
const ErrorResponse = require('../../utils/error-response');

const UI_EMAIL_VERIFICATION_URI =
    process.env.UI_EMAIL_VERIFICATION_URI;
const UI_PASSWORD_RESET_URI =
    process.env.UI_PASSWORD_RESET_URI;
const TALASHNET_EMAIL = process.env.TALASHNET_EMAIL;

class CheckTokenError extends ErrorResponse {
    constructor(message) {
        super('AuthenticationError', message, 401);
    }
}

/**
 * @description Create new account
 * @route       POST /api/v1/auth/register
 * @access      Public
 * @next        Call next middleware to send back response
 */
module.exports.register = async (req, res, next) => {
    let { email, password } = req.body;
    let role = await Role.findOne({
        where: { accessToken: 'user' },
    });
    let {
        hashedPassword,
        salt,
    } = await passwordUtil.hashPassword(password);
    let user = await User.create({
        email,
        hashedPassword,
        roleId: role.id,
        saltPassword: salt,
    });
    let token = await new Token({
        userId: user.id,
        type: 'email-verification',
        token: crypto.randomBytes(32).toString('hex'),
    }).save();

    mail.sendMail(
        'noreply@talashnet.info',
        email,
        'Talashnet - Email verification',
        `<h1>please click <a href="${UI_EMAIL_VERIFICATION_URI}/${token.token}" >this link</a></h1>`,
    );

    req.apiStatus = 200;
    req.apiData = null;
    req.apiError = null;
    next();
};

module.exports.login = async (req, res, next) => {
    let { email } = req.body;
    let user = await User.scope('justBasicDetails').findOne(
        {
            where: { email },
        },
    );
    let role = await Role.findByPk(user.roleId);
    delete user.dataValues.roleId;
    let accessToken = await authService.generateAccessToken(
        user.dataValues,
        role.title,
    );

    await new Token({
        token: accessToken,
        type: 'jwt',
        userId: user.id,
    }).save();
    req.apiStatus = 200;
    req.apiData = {
        access: accessToken,
        refresh: '',
    };
    req.apiError = null;
    next();
};

module.exports.emailVerification = async (
    req,
    res,
    next,
) => {
    let { token } = req.body;
    let t = await Token.findOneAndDelete({ token });

    await User.update(
        {
            emailVerified: true,
        },
        {
            where: {
                id: t.userId,
            },
        },
    );

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.resendEmailVerification = async (
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
    let token = crypto.randomBytes(32).toString('hex');

    await new Token({
        token,
        userId: user.id,
        type: 'email-verification',
    }).save();
    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.logout = async (req, res, next) => {
    let { accessToken } = req.body;

    await Token.findOneAndDelete({ token: accessToken });
    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.forgotPassword = async (req, res, next) => {
    let { email } = req.body;
    let user = await User.findOne({
        where: {
            email,
        },
    });
    let token = crypto.randomBytes(32).toString('hex');

    await new Token({
        token,
        userId: user.id,
        type: 'password-reset',
    }).save();
    await mail.sendMail(
        TALASHNET_EMAIL,
        email,
        'Password reset - Talashnet',
        `<h1>please click <a href="${UI_PASSWORD_RESET_URI}/${token}" >this link</a></h1>`,
    );
    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.putPasswordReset = async (
    req,
    res,
    next,
) => {
    let { token, password } = req.body;
    let fetchedToken = await Token.findOneAndDelete({
        token,
    });
    let {
        hashedPassword,
        salt,
    } = await passwordUtil.hashPassword(password);

    await User.update(
        {
            hashedPassword,
            saltPassword: salt,
        },
        {
            where: {
                id: fetchedToken.userId,
            },
        },
    );
    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.checkToken = async (req, res, next) => {
    let { accessToken } = req.body;
    let token = accessToken.split(' ')[1];
    let [error, decoded] = await promiseHandler(
        jwt.verifyToken(token),
    );
    let user = await User.findByPk(decoded.user.id);
    let savedToken = await Token.findOne({ token });

    if (error)
        return next(
            new CheckTokenError(
                'Entered token is not valid',
            ),
        );

    if (!user)
        return next(
            new CheckTokenError(
                'Saved userId in payload does not exist in Database.',
            ),
        );

    let role = await Role.findOne({
        where: { title: decoded.user.role },
    });

    if (role.id !== decoded.user.role)
        return next(
            new CheckTokenError(
                "User's access level is not lower than 4.",
            ),
        );
    if (!savedToken)
        return next(
            new CheckTokenError(
                'Access token does not exist in Database.',
            ),
        );
    if (Date.now() - decoded.iat > 60 * 60 * 1000 * 20)
        return next(
            new CheckTokenError(
                'Access token is near expiration date.',
            ),
        );

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};
