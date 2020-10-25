const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env')
});

const User = require('../models/user');
const Role = require('../models/role');
const Image = require('../models/image');

const sequelize = require('../configs/sequelize');

(async function() {
    await sequelize.getSequelize().sync({ force: true });
    await require('./role')(Role);
    await require('./image')(Image);
    await require('./user')(Role, User);
})();