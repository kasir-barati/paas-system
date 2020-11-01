const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

const passwordUtil = require('../utils/password');
const dockerService = require('../services/docker');

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
        name: 'super admin',
        phone: '09101234567',
        emailVerified: true,
        saltPassword: sadminSalt,
        roleId: superAdminRole.id,
        email: 'sadmin@sadmin.com',
        hashedPassword: sadminHashedPassword,
        networkId: await dockerService.createNetwork()
    });
    await User.create({
        name: 'admin',
        emailVerified: true,
        phone: '09101234567',
        roleId: adminRole.id,
        saltPassword: adminSalt,
        email: 'admin@admin.com',
        hashedPassword: adminHashedPassword,
        networkId: await dockerService.createNetwork()
    });
    await User.create({
        emailVerified: true,
        phone: '09101234567',
        name: 'technical admin',
        roleId: technicalAdminRole.id,
        saltPassword: technicalAdminSalt,
        email: 'technicaladmin@admin.com',
        hashedPassword: technicalAdminHashedPassword,
        networkId: await dockerService.createNetwork()
    });
    await User.create({
        emailVerified: true,
        name: 'seller admin',
        phone: '09101234567',
        roleId: sellerAdminRole.id,
        saltPassword: sellerAdminSalt,
        email: 'selleradmin@admin.com',
        hashedPassword: sellerAdminHashedPassword,
        networkId: await dockerService.createNetwork()
    });
    await User.create({
        name: 'user',
        roleId: userRole.id,
        phone: '09101234567',
        emailVerified: true,
        saltPassword: userSalt,
        hashedPassword: userHashedPassword,
        email: 'amirhoseinamz45@gmail.com',
        networkId: await dockerService.createNetwork()
    });
};