const jwt = require('../utils/jwt');
const User = require('../models/user')
const Role = require('../models/role');
const ErrorResponse = require('../utils/error-response');

module.exports.isUser = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) return next(new ErrorResponse('jwtError', 'Something went wrong in the user JWT middleware', 401));

    let token = authHeader.split(' ')[1];
    let decoded = await jwt.verifyToken(token);
    let user = await User.findByPk(decoded.sub);

    if (!user) return next(new ErrorResponse('Unauthorized', 'You are not authorized.', 401));

    let role = await Role.findByPk(user.roleId);

    if (role.accessLevel !== 4) return next(new ErrorResponse('Unauthorized', 'You are not authorized.', 401));

    req.userId = decoded.sub;
    next();
};