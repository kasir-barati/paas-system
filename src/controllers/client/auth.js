// const path = require('path');
const crypto = require('crypto');
// const { promises: fsPromises } = require('fs');

// const axios = require('axios').default.create({
//     baseURL: process.env.DOCKER_API_URI
// });

const mail = require('../../utils/mail');
const Role = require('../../models/role');
const User = require('../../models/user');
const Token = require('../../models/token');
const authService = require('../../services/auth');
const passwordUtil = require('../../utils/password');
const dockerService = require('../../services/docker');

const UI_EMAIL_VERIFICATION_URI = process.env.UI_EMAIL_VERIFICATION_URI;
const UI_PASSWORD_RESET_URI = process.env.UI_PASSWORD_RESET_URI;
const TALASHNET_EMAIL = process.env.TALASHNET_EMAIL;

/**
 * @description Create new account
 * @route       POST /api/v1/auth/register
 * @access      Public
 * @next        Call next middleware to send back response
 */
module.exports.register = async (req, res, next) => {
    let stage, user, token;
    try {
        let { email, password } = req.body;
        let role = await Role.findOne({ where: { accessLevel: 4 } });
        let { hashedPassword, salt } = await passwordUtil.hashPassword(password);
        // let jsonPath = path.join(__dirname, '..', '..', '..', 'docker', 'json', 'network.json');
        // let json = await fsPromises.readFile(jsonPath, 'utf8');
        // json = dockerService.replaceJsonDataForNetwork(json, {
        //     networkName: email.split('@')[0]
        // });
        // let response = await axios.post('/networks/create', JSON.parse(json));
        // if (response.status !== 201) return next(new ErrorResponse('DockerError', 'Docker could not create network.', response.status));

        user = await User.create({
            email,
            hashedPassword,
            roleId: role.id,
            saltPassword: salt
        });
        stage = '0st';

        token = await new Token({
            userId: user.id,
            type: 'email-verification',
            token: crypto.randomBytes(32).toString('hex')
        }).save();
        stage = '1st';
        
        await mail.sendMail(TALASHNET_EMAIL, email, 'Email verification - Talashnet', `<h1>please click <a href="${UI_EMAIL_VERIFICATION_URI}/${token.token}" >this link</a></h1>`);
        stage = '2st';

        req.apiStatus = 200;
        req.apiData = null;
        req.apiError = null;
        next();
    } catch(error) {
        switch (stage) {
            case '2st': 
                await token.remove();
            case '1st': 
                await user.destroy({ force: true });
                break;
        };
        next(error);
    };
};

module.exports.login = async (req, res, next) => {
    let { email } = req.body;
    let user = await User.findOne({
        where: { email }
    });
    let accessToken = await authService.generateAccessToken(user.id);

    await new Token({
        token: accessToken,
        type: 'jwt',
        userId: user.id
    }).save();
    req.apiStatus = 200;
    req.apiData = accessToken;
    req.apiError = null;
    next();
};

module.exports.emailVerification = async (req, res, next) => {
    let { token } = req.body;
    let t = await Token.findOneAndDelete({ token });

    await User.update({
        emailVerified: true
    }, {
        where: {
            id: t.userId
        }
    });

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = httpStatus.success;
    next();
};

module.exports.resendEmailVerification = async (req, res, next) => {
    let { email } = req.body;
    let user = await User.findOne({ 
        where: { 
            email 
        } 
    });
    let token = crypto.randomBytes(32).toString('hex');

    await new Token({
        token,
        userId: user.id,
        type: 'email-verification'
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

module.exports.postPasswordReset = async (req, res, next) => {
    let { email } = req.body;
    let user = await User.findOne({
        where: {
            email
        }
    });
    let token = crypto.randomBytes(32).toString('hex');
    
    await new Token({
        token,
        userId: user.id,
        type: 'password-reset'
    }).save();
    await mail.sendMail(TALASHNET_EMAIL, email, 'Password reset - Talashnet', `<h1>please click <a href="${UI_PASSWORD_RESET_URI}/${token}" >this link</a></h1>`);
    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};

module.exports.putPasswordReset = async (req, res, next) => {
    let { token, password } = req.body;
    let fetchedToken = await Token.findOneAndDelete({ token });
    let { hashedPassword, salt } = await passwordUtil.hashPassword(password);
    
    await User.update({
        hashedPassword, saltPassword: salt
    }, {
        where: {
            id: fetchedToken.userId
        }
    });
    req.apiData = null;
    req.apiStatus = 200;
    req.apiError = null;
    next();
};