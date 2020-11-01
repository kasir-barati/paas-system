const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');
const Container = require('./container');

class Service extends Model { };
Service.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    serviceId: DataTypes.STRING, // docker serviceId
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    resources: DataTypes.JSON, // { ram: 2, cpu: 1, storage: 5 }
    scale: {
        defaultValue: 1,
        type: DataTypes.SMALLINT
    },
    state: {
        defaultValue: 'accepted',
        type: DataTypes.ENUM('shutodwn', 'running', 'accepted', 'failed', 'freeze')
    },
    port: DataTypes.STRING, // exposed port
    env: DataTypes.ARRAY(DataTypes.STRING) // { a: 1, b: 'c' }/{ d: 'asd', e: 'a', l: 2 } docker service Envs
}, {
    paranoid: true,
    timestamps: true,
    modelName: 'services',
    sequelize: sequelize.getSequelize(),
});

// 1
Service.hasMany(Container);
// N
Container.belongsTo(Service);

module.exports = Service;