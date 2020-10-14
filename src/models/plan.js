const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class PlanModel extends Model {};
PlanModel.init({
    name: {
        primaryKey: true,
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    price: {
        type: DataTypes.REAL,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    ram: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    cpu: {
        type: DataTypes.REAL,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    }
},{
    sequelize,
    modelName: 'plans'
});

module.exports = PlanModel;