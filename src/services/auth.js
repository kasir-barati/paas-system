const jwt = require('../utils/jwt');

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;

/*
 * generate jwt token with the userId
 * @params {String} userId
 * @returns {String} accessToken
 */
module.exports.generateAccessToken = async id => { 
    let payload = {
        sub: id,
        iat: Date.now()
    };

    return await jwt.generateAccessToken(payload, ACCESS_TOKEN_EXPIRES_IN);
};