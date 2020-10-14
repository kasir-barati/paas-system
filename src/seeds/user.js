module.exports = async (Role, User) => {
    let superAdminRole = Role.findOne({
        where: {
            accessLevel: 0
        }
    });
    let adminRole = Role.findOne({
        where: {
            accessLevel: 1
        }
    });
    let technicalAdminRole = Role.findOne({
        where: {
            accessLevel: 2
        }
    });
    let sellerAdminRole = Role.findOne({
        where: {
            accessLevel: 3
        }
    });
    let userRole = Role.findOne({
        where: {
            accessLevel: 4
        }
    });

    await User.create({
        email: 'superadmin.com',
        password: 'superadmin',
        roleId: superAdminRole.id
    });
    await User.create({
        email: 'admin.com',
        password: 'admin',
        roleId: adminRole.id
    });
    await User.create({
        email: 'technicaladmin.com',
        password: 'technicaladmin',
        roleId: technicalAdminRole.id
    });
    await User.create({
        email: 'selleradmin.com',
        password: 'selleradmin',
        roleId: sellerAdminRole.id
    });
    await User.create({
        email: 'user.com',
        password: 'user',
        roleId: userRole.id
    });
};