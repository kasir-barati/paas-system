const User = require('../models/user');

module.exports.readUsers = async opt => {
    let users = await User.findAll(opt);
    
    return users ? users : [];
};

module.exports.readUser = async opt => {
    let user = await User.findOne(opt);

    return user ? user : {};
};

module.exports.createUser = async user => {
    let data = await User.create(user);

    return data ? data : [];
};

module.exports.updateUser = async (user, opt) => {
    let data = await User.update(user, opt);
    
    return data ? data : null;
};

module.exports.deleteUser = async id => {
    let user = await User.findOne({
        where: { id }
    });
    
    await user.destroy();
    return user ? user : null;
};