const jwt = require('../utils/jwt');
const Token = require('../models/token');

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

/*
 * generate jwt token with the given ID
 * @params {ObjectID} user id
 * @returns {Object} {accessToken, refreshToken}
 */
module.exports.generateJwt = async id => { 
    let payload = {
        sub: id,
        iat: Data.now()
    };
    let accessToken = await jwt.generateAccessToken(payload, ACCESS_TOKEN_EXPIRES_IN);
    let refreshToken = await jwt.generateToken(payload, REFRESH_TOKEN_EXPIRES_IN);
    let token = new Token({
        token: {
            accessToken, refreshToken
        },
        type: 'jwt',
        userId: id
    });

    await token.save();
    return { accessToken, refreshToken };
};

/*
 * add token to the black list
 * @params {String} accessToken
 * @params {String} refreshToken
 * */
module.exports.addToBlackListTokens = async (accessToken, refreshToken) => {
    return new Promise((resolve, reject) => {
        Token.deleteOne({
            token: {
                accessToken, refreshToken
            }
        }, error => {
            if (error) reject(error);
            else resolve();
        });
    });
};