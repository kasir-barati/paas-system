const jwt = require('../utils/jwt');
const User = require('../models/user')
const Role = require('../models/role');
const ErrorResponse = require('../utils/error-response');

module.exports.isUser = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (authHeader) {
        let token = authHeader.split(' ')[1];
        let decoded = await jwt.verifyToken(token);
        let user = await User.findByPk(decoded.sub);
        
        if (user) {
            let role = await Role.findByPk(user.roleId);
            // console.log('Role: %s', user);
            console.log('Role: %s', role);
            role.accessLevel === 4 ? next() : next(new ErrorResponse('Unauthorized', 'You are not authorized.', 401));
        } else {
            console.log('User: %s', user);
            next(new ErrorResponse('Unauthorized', 'You are not authorized.', 401));
        };
    } else {
        next(new ErrorResponse('jwtError', 'Something went wrong in the user JWT middleware', 401));
    };
};