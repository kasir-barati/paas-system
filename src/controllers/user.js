const User = require('../models/user');
const Role = require('../models/role');

module.exports.getUsers = async (req, res, next) => {
    let users = await User.findAll();
    
    req.status = 200; 
    req.data = users ? users : [];
    req.error = null;
    next();
};

module.exports.getUser = async (req, res, next) => {
    let { id } = req.params;
    let user = await User.findByPk(id);

    req.status = 200; 
    req.data = user ? user : [];
    req.error = null;
    next();
};

module.exports.createUser = async (req, res, next) => {
    let { email, password, roleId } = req.body;
    let user = await User.create({ 
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
    let user = await User.update({
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
    let user = await User.findByPk(id);
    
    await user.destroy();
    req.status = 200; 
    req.data = user ? user : [];
    req.error = null;
    console.log('user deleted');
    next();
};