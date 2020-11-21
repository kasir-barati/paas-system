const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');
const Container = require('./container');

class Service extends Model {}
Service.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            unique: true,
            type: DataTypes.STRING,
        },
        serviceID: {
            type: DataTypes.STRING,
        },
        serviceVersion: {
            type: DataTypes.SMALLINT,
        },
        serviceCreatedAt: {
            type: DataTypes.DATE,
        },
        serviceUpdatedAt: {
            type: DataTypes.DATE,
        },
        serviceName: {
            type: DataTypes.STRING,
        },
        serviceImage: {
            type: DataTypes.STRING,
        },
        serviceHostname: {
            type: DataTypes.STRING,
        },
        serviceMounts: {
            type: DataTypes.ARRAY(DataTypes.JSON),
        },
        serviceResources: {
            type: DataTypes.JSON,
        },
        servicePlacement: {
            type: DataTypes.STRING,
        },
        serviceReplicas: {
            type: DataTypes.SMALLINT,
        },
        servicePorts: {
            type: DataTypes.ARRAY(DataTypes.JSON),
        },
        serviceVirtualIPs: {
            type: DataTypes.ARRAY(DataTypes.JSON),
        },
        price: {
            type: DataTypes.STRING,
        },
    },
    {
        paranoid: true,
        timestamps: true,
        modelName: 'services',
        sequelize: sequelize.getSequelize(),
    },
);

// 1
Service.hasMany(Container);
// N
Container.belongsTo(Service);

module.exports = Service;
