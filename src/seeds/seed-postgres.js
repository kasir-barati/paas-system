const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env')
});

const User = require('../models/user');
const Role = require('../models/role');

const sequelize = require('../configs/sequelize');

(async function() {
    await sequelize.getSequelize().sync({ force: true });
    require('./role')(Role);
    require('./user')(Role, User);
})();