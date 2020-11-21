const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class Task extends Model {}
Task.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        taskID: {
            type: DataTypes.STRING,
        },
        taskVersion: {
            type: DataTypes.SMALLINT,
        },
        taskCreatedAt: {
            type: DataTypes.DATE,
        },
        taskUpdatedAt: {
            type: DataTypes.DATE,
        },
        taskServiceID: {
            type: DataTypes.STRING,
        },
        taskNodeID: {
            type: DataTypes.STRING,
        },
        taskState: {
            type: DataTypes.ENUM(
                'created',
                'restarting',
                'running',
                'paused',
                'exited',
                'dead',
            ),
        },
        taskContainerID: {
            type: DataTypes.STRING,
        },
        taskDesiredState: {
            type: DataTypes.STRING,
        },
        taskNetworkID: {
            type: DataTypes.STRING,
        },
    },
    {
        paranoid: true,
        timestamps: true,
        modelName: 'containers',
        sequelize: sequelize.getSequelize(),
    },
);

module.exports = Task;
