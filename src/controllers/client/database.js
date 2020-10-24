const path = require('path');
const crypto = require('crypto');
const { promises: fsPromises } = require('fs');

const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

const User = require('../../models/user');
const Service = require('../../models/service');
const Container = require('../../models/container');
const dockerService = require('../../services/docker');
const { unUsePort } = require('../../utils/port-scanner');
const ErrorResponse = require('../../utils/error-response');

module.exports.createDatabaseService = async (req, res, next) => {
    let stage, service, serviceContainer;
    try {
        let { userId } = req;
        let { serviceName, imageName, ram, cpu, storage, version } = req.body;
        let jsonPath = path.join(__dirname, '..', '..', '..', 'docker', 'json', `${imageName}.json`);
        let price = (ram * 100) + (cpu * 200) + (storage * 300);
        let dbName = crypto.randomBytes(4).toString('hex');
        let dbPass = crypto.randomBytes(12).toString('hex');
        let publishedPort = await unUsePort(33000, 45000);
        let json = await fsPromises.readFile(jsonPath, 'utf8');
        let user = await User.findByPk(userId);
        serviceName = `${serviceName}_db`;
    
        json = dockerService.replaceJsonDataForDb(json, { 
            serviceName, version, cpu, ram, publishedPort, dbName, dbPass, networkName: user.email.split('@')[0]
        });
        let response = await axios.post('/services/create', JSON.parse(json));
        if (response.status !== 201) return next(new ErrorResponse('DockerError', 'Docker could not create service', response.status));

        service = await Service.create({
            price,
            state: 'accepted',
            name: serviceName,
            port: publishedPort,
            id: response.data.ID,
            env: { dbName, dbPass },
            resource: { ram, cpu, storage }
        });
        stage = '0st';

        let container = await dockerService.checkContainerOfService(service.id, 5);
        serviceContainer = await Container.create({
            id: container.Id,
            state: container.State,
            status: container.Status,
            name: container.Labels["com.docker.swarm.task.name"],
            taskId: container.Labels["com.docker.swarm.task.id"],
            serviceId: container.Labels["com.docker.swarm.service.id"]
        });
        stage = '1st';

        req.apiStatus = 200;
        req.apiError = null;
        req.apiData = response.data.ID;
        next();
    } catch(error) {
        switch (stage) {
            case '1st': 
                await serviceContainer.destroy();
            case '0st': 
                await service.destroy({ force: true });
                break;
        };
        next(error);
    };
};
module.exports.getProjects = async (req, res, next) => { };
module.exports.putProject = async (req, res, next) => { };
module.exports.deleteProject = async (req, res, next) => { };

module.exports.putProjectResource = async (req, res, next) => { };
module.exports.getProjectStats = async (req, res, next) => { };
module.exports.getIrojectInspect = async (req, res, next) => { };
module.exports.getProjectLogs = async (req, res, next) => { };
module.exports.postProjectCommandLine = async (req, res, next) => { };
module.exports.putProjectUpdateEnv = async (req, res, next) => { };