module.exports = async (Role) => {
    await Role.create({
        title: 'admin',
    });
    await Role.create({
        title: 'user',
    });
};
