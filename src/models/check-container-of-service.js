const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const checkContainerOfService = new Schema({
    ip: String,
    userId: String,
    counter: Number,
    serviceId: String,
    containerId: {
        type: String,
        default: null
    }
}, {
    timestamps: {
        updatedAt: 'updatedAt',
        createdAt: 'createdAt'
    }
});

module.exports = mongoose.model('checkContainerOfService', checkContainerOfService);