// const path = require('path');
// const { promises: fsPromises } = require('fs');

// const axios = require('axios').default.create({
//     baseURL: process.env.DOCKER_API_URI
// });

const passwordUtil = require('../utils/password');
// const dockerService = require('../services/docker');

module.exports = async (Role, User) => {
    let superAdminRole = await Role.findOne({ where: { accessLevel: 0 } });
    let adminRole = await Role.findOne({ where: { accessLevel: 1 } });
    let technicalAdminRole = await Role.findOne({ where: { accessLevel: 2 } });
    let sellerAdminRole = await Role.findOne({ where: { accessLevel: 3 } });
    let userRole = await Role.findOne({ where: { accessLevel: 4 } });
    let { hashedPassword: sadminHashedPassword, salt: sadminSalt } = await passwordUtil.hashPassword('superadminPass1');
    let { hashedPassword: adminHashedPassword, salt: adminSalt } = await passwordUtil.hashPassword('adminPass1');
    let { hashedPassword: technicalAdminHashedPassword, salt: technicalAdminSalt } = await passwordUtil.hashPassword('technicaladminPass1');
    let { hashedPassword: sellerAdminHashedPassword, salt: sellerAdminSalt } = await passwordUtil.hashPassword('selleradminPass1');
    let { hashedPassword: userHashedPassword, salt: userSalt } = await passwordUtil.hashPassword('userPass1');

    await User.create({
        email: 'sadmin@sadmin.com',
        name: 'super admin',
        phone: '09101234567',
        emailVerified: true,
        hashedPassword: sadminHashedPassword,
        saltPassword: sadminSalt,
        roleId: superAdminRole.id
    });
    await User.create({
        email: 'admin@admin.com',
        name: 'admin',
        phone: '09101234567',
        emailVerified: true,
        hashedPassword: adminHashedPassword,
        saltPassword: adminSalt,
        roleId: adminRole.id
    });
    await User.create({
        email: 'technicaladmin@admin.com',
        name: 'technical admin',
        phone: '09101234567',
        emailVerified: true,
        hashedPassword: technicalAdminHashedPassword,
        saltPassword: technicalAdminSalt,
        roleId: technicalAdminRole.id
    });
    await User.create({
        email: 'selleradmin@admin.com',
        name: 'seller admin',
        phone: '09101234567',
        emailVerified: true,
        hashedPassword: sellerAdminHashedPassword,
        saltPassword: sellerAdminSalt,
        roleId: sellerAdminRole.id
    });
    await User.create({
        email: 'user@user.com',
        name: 'user',
        phone: '09101234567',
        emailVerified: true,
        hashedPassword: userHashedPassword,
        saltPassword: userSalt,
        roleId: userRole.id
    });
    // let jsonPath = path.join(__dirname, '..', '..', 'docker', 'json', 'network.json');
    // let json = await fsPromises.readFile(jsonPath, 'utf8');
    // json = dockerService.replaceJsonDataForNetwork(json, {
    //     networkName: 'user'
    // });
    // await axios.post('/networks/create', JSON.parse(json));
};