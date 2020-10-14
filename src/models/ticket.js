const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class TicketModel extends Model{};
TicketModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'waiting'
    }
}, {
    sequelize,
    modelName: 'tickets'
});

module.exports = TicketModel;