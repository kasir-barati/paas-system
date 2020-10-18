const { promises: fsPromises } = require('fs');
const crypto = require('crypto');
const path = require('path');
const util = require('util');

const generateKeyPair = util.promisify(crypto.generateKeyPair);

//module.exports.genKeyPair = async () => {
(async () => {
    let keyPair = await generateKeyPair('rsa', {
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        modulusLength: 4096
    });
    console.log(keyPair.publicKey);
    await fsPromises.writeFile(path.join(__dirname, '..', '..', 'keys', 'id_rsa_public.pem'), keyPair.publicKey);
    await fsPromises.writeFile(path.join(__dirname, '..', '..', 'keys', 'id_rsa_private.pem'), keyPair.privateKey);
})();
