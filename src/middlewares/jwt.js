const jwt = require('../utils/jwt');
const Token = require('../models/token');
const { promiseHandler } = require('../utils/promise');
const ErrorResponse = require('../utils/error-response');

class AuthorizationError extends ErrorResponse {
    constructor(message) {
        super('AuthorizationError', message, 403);
    }
}

class AuthenticationError extends ErrorResponse {
    constructor(message) {
        super('AuthenticationError', message, 401);
    }
}

module.exports.isAuthenticated = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(
            new AuthenticationError(
                'Authorization does not exist in the incoming http header.',
            ),
        );
    }

    let token = authHeader.split(' ')[1];
    let [verifyError, decoded] = await promiseHandler(
        jwt.verifyToken(token),
    );

    if (verifyError) {
        return next(
            new AuthenticationError(verifyError.message),
        );
    }

    if (!(await Token.findOne({ token })))
        return next(
            new AuthenticationError(
                'Access token does not exist in Database.',
            ),
        );

    req.user = decoded.user;
    next();
};

module.exports.authorize = (...roles) => (
    req,
    res,
    next,
) => {
    if (!roles.includes(req.user.role)) {
        return next(
            new AuthorizationError(
                `User access is limited. user role: ${req.user.role}. required role: ${roles}`,
            ),
        );
    }
    next();
};
