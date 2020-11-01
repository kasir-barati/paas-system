const path = require('path');
const crypto = require('crypto');
const { promises: fsPromises } = require('fs');

const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

let serviceJsonPath = path.join(__dirname, '..', '..', 'docker', 'json', `service.json`);

const { promiseHandler } = require('../utils/promise');
const ErrorResponse = require('../utils/error-response');

async function createService(name, imageName, imageVersion, cpu, ram, publishedPort, volumeName, networkName, env) {
    try {
        let targetPort, nodeHostname;
        let serviceJson = await fsPromises.readFile(serviceJsonPath, 'utf8');

        serviceJson = JSON.parse(serviceJson);

        switch (imageName) {
            case 'wordpress':
                targetPort = 80;
                nodeHostname = 'debian';
                break;
            case 'mysql':
                targetPort = 3306;
                nodeHostname = 'debian';
                break;
            case 'postgres':
                targetPort = 5432;
                nodeHostname = 'debian';
                break;
            case 'mariadb':
                targetPort = 3306;
                nodeHostname = 'debian';
                break;
            case 'mongodb':
                targetPort = 27017;
                nodeHostname = 'debian';
                break;
            // case 'mssql':
            //     targetPort = 1433;
            //     nodeHostname = 'debian';
            //     break;
        };

        serviceJson.Name = name;
        serviceJson.Networks[0].Target = networkName;
        serviceJson.TaskTemplate.ContainerSpec.Env = env;
        serviceJson.TaskTemplate.ContainerSpec.Hostname = name;
        serviceJson.EndpointSpec.Ports[0].TargetPort = targetPort;
        serviceJson.EndpointSpec.Ports[0].PublishedPort = publishedPort;
        serviceJson.TaskTemplate.ContainerSpec.Mounts[0].Source = volumeName;
        serviceJson.Placement.Constaints = [`node.hostname==${nodeHostname}`];
        serviceJson.TaskTemplate.Resources.Limits.NanoCPUs = cpu * 1_000_000_000;
        serviceJson.TaskTemplate.Resources.Limits.MemoryBytes = ram * 1_073_741_824;
        serviceJson.TaskTemplate.ContainerSpec.Image = `${imageName}:${imageVersion}`;

        let serviceResponse = await axios.post('/services/create', serviceJson);

        return serviceResponse.status === 201 ? serviceResponse.data.ID : null;
    } catch (error) {
        await promiseHandler(axios.delete(`/services/${name}`));
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

async function createVolume(volumeName, storageSize) {
    // set storage size here
    try {
        let volumeJson = {
            Name: `${volumeName}`,
            Driver: "local"
        };
        let createVolumeResponse = await axios.post('/volumes/create', volumeJson);
    } catch (error) {
        await axios.post(`/volumes/${volumeName}`);
        throw new ErrorResponse('DockeError', error.message, error.response.status);
    };
};

async function createNetwork() {
    try {
        let bodyJson = {
            Ingress: false,
            Internal: false,
            Attachable: true,
            EnableIPv6: false,
            Driver: "overlay",
            CheckDuplicate: true,
            Name: crypto.randomBytes(16).toString('hex')
        };
        let response = await axios.post(`/networks/create`, bodyJson);
        return response.status === 200 ? response.data.Id : null;
    } catch(error) {
        await promiseHandler(axios.delete(`/networks/${networkName}`));
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

function craeteExec(command) {
    let obj = {
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        DetachKeys: "ctrl-p,ctrl-q",
        Tty: false,
        Cmd: [`${command}`],
        Env: []
    };
    return obj;
};

function startExec() {
    let obj = {
        Detach: false,
        Tty: true
    };
    return obj;
};

async function containerOfService(serviceId) {
    try {
        let response = await axios.get('/containers/json?is-task=true');
        for (let container of response.data) {
            if (container.Labels["com.docker.swarm.service.id"] === serviceId) return container;
        };
        return null;
    } catch (error) {
        throw new ErrorReponse('DockerError', error.message, error.response.status);
    };
};

async function checkNetwork(networkName) {
    try {
        let response = await axios.get(`/networks/${networkName}`);
        return response.status == 200 ? true : false;
    } catch (error) {
        console.log();
        if (error.response.status === 404) {
            return false
        } else {
            throw new ErrorResponse('DockerError', error.message, error.response.status);
        };
    };
};

async function deleteService (serviceId) {
    try {
        let response = await axios.delete(`/services/${serviceId}`);
        return response.status === 200 ? true : false;
    } catch (error) {
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

module.exports = {
    containerOfService,
    deleteService,
    createService,
    createNetwork,
    createVolume,
    checkNetwork,
    craeteExec,
    startExec
};