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
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
    },
    balance: {
        defaultValue: 5000,
        type: DataTypes.FLOAT
    },
    emailVerified: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    },
    saltPassword: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    isDeleted: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    }
}, {
    paranoid: false,
    modelName: 'users',
    sequelize: sequelize.getSequelize()
});

Role.hasMany(User);
User.belongsTo(Role);

module.exports = User;