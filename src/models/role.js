const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class Role extends Model {};
Role.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'admin'
    }
}, {
    paranoid: true,
    modelName: 'roles',
    sequelize: sequelize.getSequelize()
});

module.exports = Role;