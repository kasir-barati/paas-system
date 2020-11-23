const Image = require('../../models/image');
const Service = require('../../models/service');

module.exports.createProjectService = async (req, res, next) => {
    let errorMessage = [];
    let { projectName, ram, cpu, storage } = req.body;
    let image = await Image.findOne({
        where: { name: imageName }
    });

    if (!image) {
        errorMessage.push('Wrong image name');
    };
    await Service.findOne({ where: { name: projectName } }) ? errorMessage.push('Duplicate service name') : '';
    // how to check we have requested ram, cpu & storage?
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.updateProjectResources = async (req, res, next) => {
    let errorMessage = [];
    let { id } = req.params;
    let { ram, cpu, storage } = req.body;
    let project = await Service.findByPk(id);

    if (!project) {
        errorMessage.push('Wrong project id');
    } else {
        // can user downgrade its storage?
        // can user downgrade its cpu?
        // can user downgrade its ram?
        project.resources.storage > storage ? errorMessage.push('Wrong storage size selected') : '';
        // how to check ram, cpu & storage? can we accomplish it?
    };
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.updateProjectEnvs = async (req, res, next) => {
    let errorMessage = [];
    let { id } = req.params;
    let { envs } = req.body;
    let project = await Service.findByPk(id);
    
    if (!project) {
        errorMessage.push('Wrong project id');
    } else {
        // can user update its project env?
        // اینا رو به صورت آرایه ای از رشته بگیرم یا آبجکتی متشکل از کلید و مقدار؟
        envs > storage ? errorMessage.push('Wrong storage size selected') : '';
        // how to check ram, cpu & storage? can we accomplish it
    };
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.checkProjectId = async (req, res, next) => {
    let errorMessage = [];
    let { id } = req.params;
    
    !await Service.findByPk(id) ? errorMessage.push('Wrong project id') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.execInProject = async (req, res, next) => {
    // should i filter commands?
    next();
};