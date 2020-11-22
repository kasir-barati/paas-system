const passwordUtil = require('../utils/password');
const dockerService = require('../services/docker');

module.exports = async (Role, User) => {
    let adminRole = await Role.findOne({
        where: { title: 'admin' },
    });
    let userRole = await Role.findOne({
        where: { title: 'user' },
    });
    let {
        hashedPassword: adminHashedPassword,
        salt: adminSalt,
    } = await passwordUtil.hashPassword('adminPass1');
    let {
        hashedPassword: userHashedPassword,
        salt: userSalt,
    } = await passwordUtil.hashPassword('userPass1');

    await User.create({
        name: 'admin',
        emailVerified: true,
        phone: '09101234567',
        roleId: adminRole.id,
        saltPassword: adminSalt,
        email: 'admin@admin.com',
        hashedPassword: adminHashedPassword,
    });
    await User.create({
        name: 'user',
        roleId: userRole.id,
        phone: '09101234567',
        emailVerified: true,
        saltPassword: userSalt,
        hashedPassword: userHashedPassword,
        email: 'amirhoseinamz45@gmail.com',
    });
};
