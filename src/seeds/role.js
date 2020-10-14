module.exports = async Role => {
    await Role.create({
        department: 'super-admin',
        accessLevel: 0
    });
    await Role.create({
        department: 'admin',
        accessLevel: 1
    });
    await Role.create({
        department: 'technical-admin',
        accessLevel: 2
    });
    await Role.create({
        department: 'seller-admin',
        accessLevel: 3
    });
    await Role.create({
        department: 'user',
        accessLevel: 4
    });
};