const userService = require('../services/user');
const roleService = require('../services/role');

module.exports.getUsers = async (req, res, next) => {
    let users = await userService.readUsers({});
    
    req.status = 200; 
    req.data = users ? users : [];
    req.error = null;
    next();
};

module.exports.getUser = async (req, res, next) => {
    let { id } = req.params;
    let user = await userService.readUser({
        where: { id }
    });

    req.status = 200; 
    req.data = user ? user : [];
    req.error = null;
    next();
};

module.exports.createUser = async (req, res, next) => {
    let { email, password, roleId } = req.body;
    let user = await userService.createUser({ 
        email, password, roleId
    }); 
    
    req.status = 201;
    req.data = user ? user : [];
    req.error = null;
    console.log('user created');
    next();
};

module.exports.updateUser = async (req, res, next) => {
    let { id } = req.params;
    let { email, password } = req.body;
    let user = await userService.updateUser({
        email, password
    }, {
        where: {
            id
        }
    });

    req.status = 200; 
    req.data = user ? user : [];
    req.error = null;
    console.log('user updated');
    next();
};

module.exports.deleteUser = async (req, res, next) => {
    let { id } = req.params;
    let user = await userService.deleteUser(id);

    req.status = 200; 
    req.data = user ? user : [];
    req.error = null;
    console.log('user deleted');
    next();
};
