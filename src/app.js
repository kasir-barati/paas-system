const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});

const Logger = require('./utils/logger');
const logger = new Logger('initalize-app');

require('./configs/unhandled-errors').configure(logger, require('./utils/mail'));

const cors = require('cors');
const express = require('express');

const app = express();

const NODE_ENV = process.env.NODE_ENV;
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/client/api/v1/auth', require('./routes/client/auth'));
app.use('/client/api/v1/profiles', require('./routes/client/profile'));
app.use('/client/api/v1/users', require('./routes/user'));
app.use('/client/api/v1/roles', require('./routes/role'));
app.use(require('./middlewares/send-response'));
app.use(require('./middlewares/endpoint-not-found'));
app.use(require('./middlewares/express-error-handler'));

app.listen(APP_PORT, APP_HOST, error => {
    if (error) throw error;
    else { 
        require('./configs/mongodb').connect(logger);
        if (NODE_ENV === 'development') {
            require('./configs/sequelize').getSequelize().sync({ force: true });
        } else {
            require('./configs/sequelize').getSequelize().sync();
        };
        logger.info(`Server is up & running on ${NODE_ENV} mode on port ${APP_PORT}`)
    };
});