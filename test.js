const Dockerode = require('dockerode');
const Docekrode = require('dockerode');

const docker = new Dockerode({
    host: 'http://127.0.0.1',
    port: 2375,
});

docker
    .getService('wg0w1fb2jcyc')
    .inspect()
    .then((service) => {
        console.log(
            
        );
    })
    .catch(console.error);
