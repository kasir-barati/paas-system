const mongoose = require('mongoose');

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

/**
 * @returns {Promise<Object>} db
 */
module.exports.connect = async function (logger) {
    await mongoose.connect(MONGODB_CONNECTION_STRING, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    logger.info('MongoDB database connected.', {
        meta: { 'connectionString': MONGODB_CONNECTION_STRING }
    });
};