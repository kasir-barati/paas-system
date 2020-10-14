const crypto = require('crypto');
const { promisify } = require('util');

const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * compare password & hashedPassword, if matched return true
 * @param {string} password 
 * @param {string} hashedPassword 
 * @param {string} salt 
 * @return {Promise<Boolean>}
 */
module.exports.compare = async (password, hashedPassword, salt) => { 
    let hashPassword = (await pbkdf2(password, salt, 1000, 64, 'sha512')).toString('hex');

    return hashedPassword === hashPassword;
};

/**
 * hash password
 * @param {string} password
 * @return {Promise<Object>} salt, hashedPassword
 */
module.exports.hashPassword = async password => {
    let salt = crypto.randomBytes(32).toString('hex')
    let hashedPassword = await pbkdf2(password, salt, 1000, 64, 'sha512');

    return {
        salt,
        hashedPassword: hashedPassword.toString('hex')
    };
};