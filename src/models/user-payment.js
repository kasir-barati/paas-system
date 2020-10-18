const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class UserPaymentModel extends Model{};
UserPaymentModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    refId: {
        type: DataTypes.STRING
    },
    status: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    },
}, {
    sequelize,
    timestamps: true,
    updatedAt: false,
    paranoid: false,
    modelName: 'userPayments'
});

module.exports = UserPaymentModel;