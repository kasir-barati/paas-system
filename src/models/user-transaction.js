const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class UserTransactionModel extends Model{};
UserTransactionModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    balance: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    }
}, {
    sequelize,
    timestamps: true,
    updatedAt: false,
    paranoid: false,
    modelName: 'userTransactions'
});

module.exports = UserTransactionModel;