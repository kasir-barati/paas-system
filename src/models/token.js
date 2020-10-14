const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const EXPIRES_AFTER_SECONDS = process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_AFTER_SECOND;

const tokenSchema = new Schema({
    type: String,
    token: Object,
    userId: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

tokenSchema.index({ 
    createdAt: 1 
}, {
    expiresAfterSeconds: EXPIRES_AFTER_SECONDS
});

module.exports = mongoose.model('tokens', tokenSchema);