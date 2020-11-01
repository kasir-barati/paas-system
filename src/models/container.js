const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class ProjectContainer extends Model { };
ProjectContainer.init({
    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    state: {
        type: DataTypes.ENUM('created', 'restarting', 'running', 'paused', 'exited', 'dead')
    },
    taskId: DataTypes.STRING,
    nodeId: DataTypes.STRING,
    status: DataTypes.STRING,
    version: DataTypes.STRING
}, {
    paranoid: true,
    timestamps: true,
    modelName: 'containers',
    sequelize: sequelize.getSequelize(),
});

module.exports = ProjectContainer;