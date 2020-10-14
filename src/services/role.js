const Role = require('../models/role');

module.exports.readRoles = async opt => {
    let roles = await Role.findAll(opt);
    
    return roles ? roles : [];
};

module.exports.readRole = async opt => {
    let role = await Role.findOne(opt);

    return role ? role : {};
};

module.exports.createRole = async role => {
    let data = await Role.create(role);

    return data ? data : [];
};

module.exports.updateRole = async (role, opt) => {
    let data = await Role.update(role, opt);
    
    return data ? data : null;
};

module.exports.deleteRole = async id => {
    let role = await Role.findOne({
        where: { id }
    });
    
    await role.destroy();
    return role ? role : null;
};

module.exports.countAll = async opt => {
    let number = await Role.findAndCountAll(opt);

    return number;
};