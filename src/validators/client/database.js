const Image = require('../../models/image');
const Service = require('../../models/service');

module.exports.createDatabaseService = async (req, res, next) => {
    let errorMessage = [];
    let { serviceName, imageName, ram, cpu, storage, version } = req.body;
    let image = await Image.findOne({
        where: { name: imageName }
    });

    if (!image) {
        errorMessage.push('Wrong image name');
    } else {
        !image.versions.includes(version) ? errorMessage.push('Wrong image version') : '';
    };
    await Service.findOne({ where: { name: serviceName } }) ? errorMessage.push('Duplicate service name') : '';
    // how to check we have requested ram, cpu & storage?
    next();
};
module.exports.getProjects = async (req, res, next) => {
    next();
};
module.exports.putProject = async (req, res, next) => {
    next();
};
module.exports.deleteProject = async (req, res, next) => {
    next();
};

module.exports.putProjectResource = async (req, res, next) => {
    next();
};
module.exports.getProjectStats = async (req, res, next) => {
    next();
};
module.exports.getIrojectInspect = async (req, res, next) => {
    next();
};
module.exports.getProjectLogs = async (req, res, next) => {
    next();
};
module.exports.postProjectCommandLine = async (req, res, next) => {
    next();
};
module.exports.putProjectUpdateEnv = async (req, res, next) => {
    next();
};