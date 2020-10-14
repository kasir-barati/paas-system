const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class ImageModel extends Model {};
ImageModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    picUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isItRright (value) {
                return (value.includes('project') || value.includes('database')) ? true : false;
            }
        }
    },
    versions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    updatedAt: false,
    paranoid: false,
    modelName: 'images'
});

module.exports = ImageModel;