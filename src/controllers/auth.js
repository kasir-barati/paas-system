const crypto = require('crypto');

const mail = require('../utils/mail');
const Role = require('../models/role');
const User = require('../models/user');
const Token = require('../models/token');
const userService = require('../services/user');
const passwordUtil = require('../utils/password');

const UI_EMAIL_VERIFICATION_URI = process.env.UI_EMAIL_VERIFICATION_URI;
const TALASHNET_EMAIL = process.env.TALASHNET_EMAIL;

/**
 * @description Create new account
 * @route       POST /api/v1/auth/register
 * @access      Public
 * @next        Call next middleware to send back response
 */
module.exports.register = async (req, res, next) => {
    let { email, password } = req.body;
    let role = await Role.findOne({ where: { accessLevel: 4 } });
    let { hashedPassword, salt } = await passwordUtil.hashPassword(password);
    let user = await userService.createUser({ 
        email,
        hashedPassword,
        roleId: role.id,
        saltPassword: salt
    });
    let token = crypto.randomBytes(32).toString('hex');

    await new Token({
        token: { token },
        userId: user.id,
        type: 'email-verification'
    }).save();
    await mail.sendMail(TALASHNET_EMAIL, email, 'test-passport email verification', `<h1>please click <a href="${UI_EMAIL_VERIFICATION_URI}/${token}" >this link</a></h1>`);
    req.apiStatus = 201;
    req.apiData = user;
    req.apiError = null;
    next();
};

module.exports.login = async (req, res, next) => {
    let { email, password } = req.body;
    let user = await userService.readUser({
        email
    });
    let { accessToken, refreshToken } = await authService.generateJwt(user._id);

    req.status = 200;
    req.data = [{
        accessToken, refreshToken
    }];
    req.error = null;
    next();
};

module.exports.logout = async (req, res, next) => {
    let { accessToken, refreshToken } = req;
    await authService.addToBlackListTokens([accessToken, refreshToken]);

    req.status = 200;
    req.data = [{
        accessToken, refreshToken
    }];
    req.error = null;
    next();
};

module.exports.emailVerification = async (req, res, next) => {
    let { token } = req.body;
    let t = await Token.findOneAndDelete({ token: { token } });

    await User.update({
        emailVerified: true
    }, {
        where: {
            id: t.userId
        }
    });

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};