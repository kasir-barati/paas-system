const path = require('path');
const { promises: fsPromises } = require('fs');

const jsonwebtoken = require('jsonwebtoken');

const PRIVATE_KEY_PATH = path.join(__dirname, '..', '..', 'keys', 'id_rsa_private.pem');
const PUBLIC_KEY_PATH = path.join(__dirname, '..', '..', 'keys', 'id_rsa_public.pem');

module.exports.generateAccessToken = async (payload, expiresIn) => {
    const privateKey = await fsPromises.readFile(PRIVATE_KEY_PATH);
    
    return new Promise((resolve, reject) => {        
        jsonwebtoken.sign(payload, privateKey, {
            expiresIn, algorithm: 'RS256'
        }, (error, accessToken) => {
            if (error) reject(error);
            else resolve(accessToken);
        });
    });
};

module.exports.verifyToken = async token => {
    const publicKey = await fsPromises.readFile(PUBLIC_KEY_PATH);

    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, publicKey, (error, decoded) => {
            if (error) reject(error);
            else resolve(decoded);
        });
    });
};

module.exports.decodeToken = token => jsonwebtoken.decode(token);