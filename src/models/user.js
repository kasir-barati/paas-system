const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');
const Role = require('./role');

class User extends Model{};
User.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    saltPassword: DataTypes.STRING,
    emailVerfied: DataTypes.BOOLEAN,
    hashedPassword: DataTypes.STRING
}, {
    paranoid: false,
    modelName: 'users',
    sequelize: sequelize.getSequelize()
});

Role.hasMany(User);
User.belongsTo(Role);

module.exports = User;