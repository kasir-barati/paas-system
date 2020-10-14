const roleService = require('../services/role');

module.exports.getRoles = async (req, res, next) => {
    // let { page } = req.params;
    let roles = await roleService.readRoles({}); // { limit: }
    // let totalCount = await roleService.countAll({});

    req.status = 200; 
    // req.data.paging = {
    //     totalCount,
    //     currentPage: page,
    //     pageSize: 30, // limit
    //     start: 301, // (page * limit) + 1
    //     end: totalCount
    // };
    req.data = {
        list: roles
    };
    req.error = null;
    next();
};

module.exports.getRole = async (req, res, next) => {
    let { id } = req.params;
    let role = await roleService.readRole({
        where: { id }
    });

    req.status = 200; 
    req.data = role;
    req.error = null;
    next();
};

module.exports.createRole = async (req, res, next) => {
    let { department, accessLevel } = req.body;
    let role = await roleService.createRole({ 
        department, accessLevel
    }); 
    
    req.status = 201;
    req.data = role;
    req.error = null;
    console.log('role created');
    next();
};

module.exports.updateRole = async (req, res, next) => {
    let { id } = req.params;
    let { department, accessLevel } = req.body;
    let role = await roleService.updateRole({
        department, accessLevel
    }, {
        where: {
            id
        }
    });

    req.status = 200; 
    req.data = role;
    req.error = null;
    console.log('role updated');
    next();
};

module.exports.deleteRole = async (req, res, next) => {
    let { id } = req.params;
    let role = await roleService.deleteRole(id);

    req.status = 200; 
    req.data = role;
    req.error = null;
    console.log('role deleted');
    next();
};