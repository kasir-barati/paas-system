const { expect } = require('chai');
const authValidator = require('../src/validators/auth');

describe('', () => {
    it('should throw validation error if registeration request body was not valid', () => {
        let req = {
            body: {
                email: 'asd',
                password: 'asd'
            }
        };
        authValidator.register(req, {}, () => {}).then(result => {
            expect(result).to.be
        });
    });
});