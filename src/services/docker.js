const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

const ErrorResponse = require('../utils/error-response');

module.exports.replaceJsonDataForDb = (json, { 
    serviceName, version, cpu, ram, publishedPort, dbName, dbPass
}) => {
    // set envs
    json = json.replace(/DB_NAME/g, dbName);
    json = json.replace(/DB_PASS/g, dbPass);
    // set image version
    json = json.replace(/VERSION/g, version);
    // set service name & service hostname (app1_db/db-wp1_db)
    json = json.replace(/SERVICE_NAME/g, serviceName);
    json = json.replace(/HOSTNAME/g, serviceName);
    // set exposed port
    json = json.replace(/PUBLISHED_PORT/g, publishedPort);
    // set resources
    json = json.replace(/NANO_CPU/g, cpu * 1_000_000_000);
    json = json.replace(/MEMORY_BYTE/g, ram * 1_073_741_824);
    // set network name
    // json = json.replace(/NETWORK_NAME/g, networkName);
    return json;
};

module.exports.replaceJsonDataForNetwork = (json, { networkName }) => {
    json = json.replace(/NAME/g, networkName);
    return json;
};

module.exports.checkContainerOfService = async (serviceId, number) => {
    let response;
    while (number) {
        response = await axios.get('/containers/json?is-task=true');
        if (response.status !== 200) throw new ErrorResponse('DockerError', 'Docker could nout fetch tasks.', 500);
        for (let container of response.data) {
            if (container.Labels["com.docker.swarm.service.id"] === serviceId) return container;
        }
        number--;
    };
    if (number === 0) throw new Error('DockerError', "Docker could not create service's container.", 500);
};