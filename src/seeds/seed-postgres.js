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
    await require('./user')(Role, User);
    
    let sadminRole = await Role.findOne({
        where: { accessLevel: 0 }
    });
    let sadmin = await User.findOne({
        where: { roleId: sadminRole.id }
    });

    await require('./image')(Image, sadmin.id);
})();