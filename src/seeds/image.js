const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

module.exports = async Image => {
    let response = await axios.get('/images/json');
    if (response.status !== 200) throw new Error('Docker could not handle request');

    for (let i = 0; i < response.data.length; i++) {
        if (i - 1 !== -1 && response.data[i].RepoTags[0].split(':')[0] === response.data[i - 1].RepoTags[0].split(':')[0]) continue;
        let image = {
            id: response.data[i].Id.split(':')[1],
            name: response.data[i].RepoTags[0].split(':')[0],
            versions: [response.data[i].RepoTags[0].split(':')[1]]
        };
        if (i + 1 !== response.data.length) response.data[i].RepoTags[0].split(':')[0] === response.data[i + 1].RepoTags[0].split(':')[0] ? image.versions.push(response.data[i + 1].RepoTags[0].split(':')[1]) : '';
        await Image.create({
            type: 'base',
            imageId: null,
            id: image.id,
            name: image.name,
            versions: image.versions,
            picUrl: `${process.env.APP_HOST}:${process.env.APP_PORT}/static/docker-images/${response.data[i].RepoTags[0].split(":")[0]}.png`,
        })
    }
};