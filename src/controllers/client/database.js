const path = require('path');
const crypto = require('crypto');
const { promises: fsPromises } = require('fs');

const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

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
        // how to read unit price of cpu, ram, storage
        let price = (ram * 100) + (cpu * 200) + (storage * 300);
        let dbName = crypto.randomBytes(4).toString('hex');
        let dbPass = crypto.randomBytes(12).toString('hex');
        let publishedPort = await unUsePort(33000, 45000);
        let serviceJsonPath = path.join(__dirname, '..', '..', '..', 'docker', 'json', `${imageName}.json`);
        let volumeJsonPath = path.join(__dirname, '..', '..', '..', 'docker', 'json', `volume.json`);
        let serviceJson = await fsPromises.readFile(serviceJsonPath, 'utf8');
        let volumeJson = await fsPromises.readFile(volumeJsonPath, 'utf8');
        
        volumeJson = dockerService.replaceJsonDataForVolume(volumeJson, { 
            volumeName: `${serviceName}_vol`,
            storageSize: storage
        });
        let response = await axios.post('/volumes/create', JSON.parse(volumeJson));
    
        serviceJson = dockerService.replaceJsonDataForDb(serviceJson, { 
            serviceName: `${serviceName}_db`, 
            version, 
            cpu, 
            ram, 
            publishedPort, 
            dbName, 
            dbPass, 
            volumeName: `${serviceName}_vol`,
        });
        let response = await axios.post('/services/create', JSON.parse(serviceJson));
        if (response.status !== 201) return next(new ErrorResponse('DockerError', 'Docker could not create service', response.status));

        let container = await dockerService.checkContainerOfService(service.id, 5);
        serviceContainer = await Container.create({
            id: container.Id,
            state: container.State,
            status: container.Status,
            name: container.Labels["com.docker.swarm.task.name"],
            taskId: container.Labels["com.docker.swarm.task.id"],
            serviceId: container.Labels["com.docker.swarm.service.id"]
        });
        stage = '0st';

        service = await Service.create({
            price,
            userId,
            state: 'running',
            name: `${serviceName}_db`,
            port: publishedPort,
            id: response.data.ID,
            env: { dbName, dbPass },
            resource: { ram, cpu, storage }
        });
        stage = '1st';

        req.apiStatus = 200;
        req.apiError = null;
        req.apiData = response.data.ID;
        next();
    } catch(error) {
        switch (stage) {
            case '1st': 
                await service.destroy({ force: true });
            case '0st': 
                await serviceContainer.destroy({ force: true });
                break;
        };
        next(error);
    };
};
module.exports.readDbImages = async (req, res, next) => {};
module.exports.putProject = async (req, res, next) => { };
module.exports.deleteProject = async (req, res, next) => { };

module.exports.putProjectResource = async (req, res, next) => { };
module.exports.getProjectStats = async (req, res, next) => { };
module.exports.getIrojectInspect = async (req, res, next) => { };
module.exports.getProjectLogs = async (req, res, next) => { };
module.exports.postProjectCommandLine = async (req, res, next) => { };
module.exports.putProjectUpdateEnv = async (req, res, next) => { };