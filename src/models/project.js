const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class ProjectModel extends Model{};
ProjectModel.init({
    name: {
        primaryKey: true,
        type: DataTypes.STRING,
        validate: {
            is: /[a-zA-Z0-9][a-zA-Z0-9_.-]/i
        }
    },
    scale: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
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
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    }
}, {
    sequelize,
    paranoid: false,
    modelName: 'projects'
});

module.exports = ProjectModel;