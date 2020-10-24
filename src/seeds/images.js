const path = require('path');
const { promises: fsPromises } = require('fs');

const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

const dockerService = require('../services/docker');

module.exports = async Image => {
    let jsonPath = path.join(__dirname, '..', '..', 'docker', 'json', 'network.json');
    let json = await fsPromises.readFile(jsonPath, 'utf8');
    json = dockerService.replaceJsonDataForNetwork(json, {
        networkName: 'user'
    });
    await axios.post('/images/json', JSON.parse(json));
    await Image.create({

    })
};