const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class Image extends Model {}
Image.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        imageId: {
            type: DataTypes.STRING,
        },
        imageRepoTags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        imageRepoDigests: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        imageParentId: {
            type: DataTypes.STRING,
        },
        imageCreated: {
            type: DataTypes.STRING,
        },
        imageContainer: {
            type: DataTypes.STRING,
        },
        imageExposedPort: {
            type: DataTypes.INTEGER,
        },
        imageEnv: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        imageCmd: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        imageWorkDir: {
            type: DataTypes.STRING,
        },
    },
    {
        paranoid: true,
        timestamps: true,
        modelName: 'images',
        sequelize: sequelize.getSequelize(),
    },
);

module.exports = Image;
