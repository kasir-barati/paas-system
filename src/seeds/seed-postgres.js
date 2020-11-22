const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env'),
});

const User = require('../models/user');
const Role = require('../models/role');
const Image = require('../models/image');
const UnitPrice = require('../models/unit-price');

const sequelize = require('../configs/sequelize');

(async function () {
    await sequelize.getSequelize().sync({ force: true });
    await require('./role')(Role);
    await require('./user')(Role, User);

    let admin = await Role.findOne({
        where: { title: 'admin' },
    });
    let user = await User.findOne({
        where: { roleId: admin.id },
    });

    await require('./image')(Image, user.id);
    await require('./unit-price')(UnitPrice, user.id);
})();
