const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

const User = require('../../models/user');
const Image = require('../../models/image');
const Service = require('../../models/service');
const Container = require('../../models/container');
const UnitPrice = require('../../models/unit-price');
const dockerService = require('../../services/docker');
const ErrorResponse = require('../../utils/error-response');
const sequelizeTransaction = require('../../utils/sequelize-transaction');
const CheckContainerOfService = require('../../models/check-container-of-service');

// create service (projectName_db) with volume (projectName_db)
// & finally check service's container state
// if container's state be running return response to the user
module.exports.createProjectService = async (req, res, next) => {
    let { userId } = req;
    let { name, ram, cpu, storage } = req.body;
    let user = await User.findByPk(userId);
    let ramPrice = await UnitPrice.findOne({
        where: {
            deletedAt: null,
            type: 'ram'
        }
    });
    let cpuPrice = await UnitPrice.findOne({
        where: {
            deletedAt: null,
            type: 'cpu'
        }
    });
    let storagePrice = await UnitPrice.findOne({
        where: {
            deletedAt: null,
            type: 'storage'
        }
    });
    let price = (ram * Number(ramPrice.price)) + (cpu * Number(cpuPrice.price)) + (storage * Number(storagePrice));
    
    // check user's network existence
    let networkStatus = await dockerService.checkNetwork(user.email.split("@")[0]);
    !networkStatus ? await dockerService.createNetwork(user.email.split("@")[0]) : '';

    let service = await sequelizeTransaction(async t => {
        return await Service.create({
            name,
            price,
            userId,
            resources: { ram, cpu, storage }
        }, {
            transaction: t
        });
    });
    
    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = service.id;
    next();
};

module.exports.createProjectViaFileUpload = async (req, res, next) => {
    let { userId } = req;
    let { id } = req.params;
    let files;
    // create service
    let container = await dockerService.containerOfService(id);
    let containerStatus = await CheckContainerOfService.findOne({
        serviceId: id,
        containerId: null
    }).exec();

    if (containerStatus === null) {
        containerStatus = await new CheckContainerOfService({
            ip: req.ip,
            userId,
            counter: 0,
            serviceId: id
        }).save();
    };

    if (container !== null) {
        await Container.create({
            id: container.Id,
            state: container.State,
            status: container.Status,
            name: container.Labels["com.docker.swarm.task.name"],
            taskId: container.Labels["com.docker.swarm.task.id"],
            nodeId: container.Labels["com.docker.swarm.node.id"],
            serviceId: container.Labels["com.docker.swarm.service.id"]
        });
        await containerStatus.updateOne({
            containerId: container.Id,
            counter: Number(containerStatus.counter) + 1
        }).exec();
    } else {
        await containerStatus.updateOne({
            counter: Number(containerStatus.counter) + 1
        }).exec();
        // containerStatus.counter === 9 ? 
    }

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = container === null ? false : true;
    next();
};

module.exports.projectsList = async (req, res, next) => {
    let { userId } = req;
    let services = await Service.findAll({
        where: { userId },
        include: [{
            model: Image,
            where: {
                name: {
                    [or]: [
                        where(fn('LOWER', Sequelize.col('name')), 'ILIKE', 'mysql'),
                        where(fn('LOWER', Sequelize.col('name')), 'ILIKE', 'mssql'),
                        where(fn('LOWER', Sequelize.col('name')), 'ILIKE', 'mongodb'),
                        where(fn('LOWER', Sequelize.col('name')), 'ILIKE', 'postgres')
                    ]
                }
            }
        }]
    });

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = services;
    next();
};

// don't delete project service from docker
module.exports.deleteProject = async (req, res, next) => {
    let { id } = req.params;
    let project = await Service.findByPk(id);
    let response = await axios.delete(`/service/${id}`);

    if (response.status !== 200) next(new ErrorResponse('DockerError', 'Docker could not delete service'));
    await project.destroy({ force: true });

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = null;
    next();
};

module.exports.updateProjectResources = async (req, res, next) => {
    let { id } = req.params;
    let { ram, cpu, storage } = req.body;
    let project = await Service.findByPk(id);
    let response = await axios.post(`/services/resources`);

    if (response.status !== 200) next(new ErrorResponse('DockerError', 'Docker could not update service resources'));
    project.resources = { ram, cpu, storage };
    await project.save();

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = null;
    next();
};

module.exports.updateProjectEnvs = async (req, res, next) => {
    let { id } = req.params;
    let { envs } = req.body;
    let project = await Service.findByPk(id);
    let response = await axios.post(`/services/envs`);

    if (response.status !== 200) next(new ErrorResponse('DockerError', 'Docker could not update service envs'));
    project.envs = envs;
    await project.save();

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = null;
    next();
};

module.exports.projectStats = async (req, res, next) => {
    let { id } = req.params;
    // https://stackoverflow.com/questions/45907274/docker-stats-in-swarm-mode
    // https://serverfault.com/questions/988801/docker-swarm-list-all-container-status
    let response = await axios.post(`/containers/${id}/stats`);

    // how can i get stream & pass it ti the front end?
    // is it necessary?
    if (response.status !== 200) next(new ErrorResponse('DockerError', 'Docker could not update service envs'));

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = response.data;
    next();
};

module.exports.projectInspect = async (req, res, next) => {
    let { id } = req.params;
    let response = await axios.post(`/services/${id}`);

    if (response.status !== 200) next(new ErrorResponse('DockerError', 'Docker could not update service envs'));

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = response.data;
    next();
};

module.exports.projectLogs = async (req, res, next) => {
    let { id } = req.params;
    let response = await axios.post(`/services/${id}/logs`);

    // wich data should i send to the user
    if (response.status !== 200) next(new ErrorResponse('DockerError', 'Docker could not update service envs'));

    req.apiStatus = 200;
    req.apiError = null;
    req.apiData = response.data;
    next();
};

module.exports.execInProject = async (req, res, next) => { };