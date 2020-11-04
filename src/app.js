const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});

const Logger = require('./utils/logger');
const logger = new Logger('initalize-app');

require('./configs/unhandled-errors').configure(logger, require('./utils/mail'));

const express = require('express');

const app = express();

const NODE_ENV = process.env.NODE_ENV;
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./middlewares/logger'));
app.use('/client/api/v1/auth', require('./routes/client/auth'));
app.use('/client/api/v1/profiles', require('./routes/client/profile'));
app.use('/client/api/v1/payments', require('./routes/client/payment'));
app.use('/client/api/v1/projects', require('./routes/client/project'));
app.use(require('./middlewares/404'));
app.use(require('./middlewares/send-response'));
app.use(require('./middlewares/500'));

app.listen(APP_PORT, APP_HOST, error => {
    if (error) throw error;
    else {
        require('./configs/mongodb').connect(logger);
        NODE_ENV === 'development' ? require('./configs/sequelize').getSequelize().sync({ force: true }) : require('./configs/sequelize').getSequelize().sync();
        logger.info(`Server is up & running on ${NODE_ENV} mode. http://${APP_HOST}:${APP_PORT}`)
    };
});