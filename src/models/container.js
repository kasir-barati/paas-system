const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

// container state: https://stackoverflow.com/questions/32427684/what-are-the-possible-states-for-a-docker-container

class ProjectContainer extends Model { };
ProjectContainer.init({
    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    state: DataTypes.STRING, // created, restarting, running, paused, exited, dead
    taskId: DataTypes.STRING,
    status: DataTypes.STRING,
    version: DataTypes.STRING
}, {
    paranoid: true,
    timestamps: true,
    modelName: 'containers',
    sequelize: sequelize.getSequelize(),
});

module.exports = ProjectContainer;