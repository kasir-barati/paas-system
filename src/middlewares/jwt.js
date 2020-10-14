const jwt = require('../utils/jwt');
const User = require('../models/user')
const Role = require('../models/role');

module.exports.isAuth = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (authHeader) {
        let token = authHeader.split(' ')[1];
        let decoded = await jwt.verifyToken(token);

        // fetch user info: 
        let user = await User.findByPk(decoded.id);
        // check user privilages:
        let role = await Role.findByPk();
        console.log(decoded.id);
        // next();
    } else {
        req
    };
};