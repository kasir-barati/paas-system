const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class DatabaseModel extends Model {};
DatabaseModel.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            is: /^[a-zA-Z0-9][a-zA-Z0-9 -_.]/
        }
    },
    scale: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    freeze: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    imageVersion: {
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
    paranoid: false,
    modelName: 'databases'
});

module.exports = DatabaseModel;