require('winston-mongodb');
const winston = require('winston');

// const Axios = require('./axios');

class Logger {
    constructor (name) { 
        this._logger = winston.createLogger({
            level: 'debug',
            defaultMeta: { service: name },
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        winston.format.prettyPrint({ depth: 4, colorize: true })
                    )
                }),
                new winston.transports.MongoDB({
                    level: 'info',
                    db: process.env.MONGODB_CONNECTION_STRING,
                    options: {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    },
                    collection: 'winstonLogs',
                    metaKey: 'meta',
                    label: name
                })
            ],
            meta: true,
        });
    };

    debug(log, metadata) { this._logger.debug(log, metadata) };
    info(log, metadata) { this._logger.info(log, metadata) };
    warn(log, metadata) { this._logger.warn(log, metadata) };
    error(log, metadata) {
        this._logger.error(log, metadata);
        // send WhatsApp message
    };
};

module.exports = Logger;