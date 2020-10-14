const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class TicketMessageModel extends Model{};
TicketMessageModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    pics: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    }
}, {
    sequelize,
    timestamps: true,
    updatedAt: false,
    paranoid: false,
    modelName: 'messages'
});

module.exports = TicketMessageModel;