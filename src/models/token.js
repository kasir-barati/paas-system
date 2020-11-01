const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const EXPIRES_AFTER_SECONDS = process.env.TOKEN_EXPIRES_AFTER_SECOND;

const tokenSchema = new Schema({
    type: String,
    token: Object,
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: Number.parseInt(EXPIRES_AFTER_SECONDS)
    },
}, {
    timestamps: {
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model('tokens', tokenSchema);