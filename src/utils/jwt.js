const path = require('path');
const { promises: fsPromises } = require('fs');

const jsonwebtoken = require('jsonwebtoken');

const PRIVATE_KEY_PATH = path.join(__dirname, '..', '..', 'keys', 'id_rsa_private.pem');
const PUBLIC_KEY_PATH = path.join(__dirname, '..', '..', 'keys', 'id_rsa_public.pem');
const PRIVATE_KEY = fsPromises.readFile(PRIVATE_KEY_PATH);
const PUBLIC_KEY = fsPromises.readFile(PUBLIC_KEY_PATH);

module.exports.generateAccessToken = async (payload, expiresIn) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(payload, PRIVATE_KEY, {
            expiresIn, algorithm: 'RS256'
        }, (error, accessToken) => {
            if (error) reject(error);
            else resolve(accessToken);
        });
    });
};

module.exports.generateRefreshToken = async (payload, expiresIn) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(payload, PRIVATE_KEY, {
            expiresIn, algorithm: 'RS256'
        }, (error, refreshToken) => {
            if (error) reject(error);
            else resolve(refreshToken);
        });
    });
};

module.exports.verifyToken = async token => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, PUBLIC_KEY, (error, decoded) => {
            if (error) reject(error);
            else resolve(decoded);
        });
    });
};

module.exports.decodeToken = token => jsonwebtoken.decode(token);