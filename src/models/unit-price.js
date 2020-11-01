const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class UnitPrice extends Model {};
UnitPrice.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    type: DataTypes.ENUM('ram', 'cpu', 'storage'),
    unit: DataTypes.FLOAT,
    price: DataTypes.FLOAT
}, {
    paranoid: true,
    timestamps: true,
    sequelize: sequelize.getSequelize()
});

module.exports = UnitPrice;