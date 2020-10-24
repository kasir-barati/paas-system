const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');
const Container = require('./container');

class Service extends Model { };
Service.init({
    id: { // docker service id
        primaryKey: true,
        type: DataTypes.STRING
    },
    price: DataTypes.STRING,
    resource: DataTypes.JSON, // { ram: 2, cpu: 1, storage: 5 }
    port: DataTypes.STRING,
    freeze: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    }, // when user balance is 0
    scale: {
        defaultValue: 1,
        type: DataTypes.SMALLINT
    }, // container account
    name: DataTypes.STRING, // docker service name
    state: DataTypes.STRING, // running, shutdown, acceepted
    env: DataTypes.JSON // { a: 1, b: 'c' }/{ d: 'asd', e: 'a', l: 2 } docker service Envs
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