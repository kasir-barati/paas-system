const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

// Self-Referencing Relationship
// If i set 'type' column to the 'user', imageId would be something like this: 42cdba9f1b08
// If i set 'type' column to the 'base', imageId would be null

class Image extends Model {};
Image.init({
    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },                          // docker image id: (42cdba9f1b08)
    name: DataTypes.STRING,     // mysql/node.js.developers.kh-node-1fg3
    picUrl: DataTypes.STRING,   // url/null
    type: DataTypes.STRING,     // base/user
    versions: DataTypes.ARRAY(DataTypes.STRING),
    imageId: DataTypes.STRING   // null/id
}, {
    paranoid: true,
    timestamps: true,
    modelName: 'images',
    sequelize: sequelize.getSequelize()
});

module.exports = Image;