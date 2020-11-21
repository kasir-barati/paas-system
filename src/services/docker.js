const Dockerode = require('dockerode');

const docker = new Dockerode({
    host: process.env.DOCKER_HOST,
    port: process.env.DOCKER_PORT,
});

const ErrorResponse = require('../utils/error-response');

const DOCKER_PATH = path.join(
    __dirname,
    '..',
    '..',
    'docker',
);

class ListImagesError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

class ImageGenerateDockerfileError extends ErrorResponse {
    constructor(message) {
        super('FileSystemError', message, 500);
    }
}

class ImageInspectError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

class ImageBuildError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

async function createService(
    name,
    imageName,
    imageVersion,
    cpu,
    ram,
    publishedPort,
    volumeName,
    networkName,
    env,
) {
    try {
        let targetPort, nodeHostname;
        let serviceJson = await fsPromises.readFile(
            serviceJsonPath,
            'utf8',
        );

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
        }

        serviceJson.Name = name;
        serviceJson.Networks[0].Target = networkName;
        serviceJson.TaskTemplate.ContainerSpec.Env = env;
        serviceJson.TaskTemplate.ContainerSpec.Hostname = name;
        serviceJson.EndpointSpec.Ports[0].TargetPort = targetPort;
        serviceJson.EndpointSpec.Ports[0].PublishedPort = publishedPort;
        serviceJson.TaskTemplate.ContainerSpec.Mounts[0].Source = volumeName;
        serviceJson.Placement.Constaints = [
            `node.hostname==${nodeHostname}`,
        ];
        serviceJson.TaskTemplate.Resources.Limits.NanoCPUs =
            cpu * 1_000_000_000;
        serviceJson.TaskTemplate.Resources.Limits.MemoryBytes =
            ram * 1_073_741_824;
        serviceJson.TaskTemplate.ContainerSpec.Image = `${imageName}:${imageVersion}`;

        let serviceResponse = await axios.post(
            '/services/create',
            serviceJson,
        );

        return serviceResponse.status === 201
            ? serviceResponse.data.ID
            : null;
    } catch (error) {
        await promiseHandler(
            axios.delete(`/services/${name}`),
        );
        throw new ErrorResponse(
            'DockerError',
            error.message,
            error.response.status,
        );
    }
}

async function createVolume(volumeName, storageSize) {
    // set storage size here
    try {
        let volumeJson = {
            Name: `${volumeName}`,
            Driver: 'local',
        };
        let createVolumeResponse = await axios.post(
            '/volumes/create',
            volumeJson,
        );
    } catch (error) {
        await axios.post(`/volumes/${volumeName}`);
        throw new ErrorResponse(
            'DockeError',
            error.message,
            error.response.status,
        );
    }
}

async function createNetwork() {
    try {
        let bodyJson = {
            Ingress: false,
            Internal: false,
            Attachable: true,
            EnableIPv6: false,
            Driver: 'overlay',
            CheckDuplicate: true,
            Name: crypto.randomBytes(16).toString('hex'),
        };
        // let response = await axios.post(`/networks/create`, bodyJson);
        // return response.status === 200 ? response.data.Id : null;
    } catch (error) {
        // await promiseHandler(axios.delete(`/networks/${networkName}`));
        throw new ErrorResponse(
            'DockerError',
            error.message,
            error.response.status,
        );
    }
}

async function containerOfService(serviceId) {
    try {
        // let response = await axios.get('/containers/json?is-task=true');
        // for (let container of response.data) {
        //     if (container.Labels['com.docker.swarm.service.id'] === serviceId)
        //         return container;
        // }
        return null;
    } catch (error) {
        throw new ErrorReponse(
            'DockerError',
            error.message,
            error.response.status,
        );
    }
}

async function checkNetwork(networkName) {
    try {
        // let response = await axios.get(`/networks/${networkName}`);
        // return response.status == 200 ? true : false;
    } catch (error) {
        console.log();
        if (error.response.status === 404) {
            return false;
        } else {
            throw new ErrorResponse(
                'DockerError',
                error.message,
                error.response.status,
            );
        }
    }
}

async function deleteService(serviceId) {
    try {
        // let response = await axios.delete(`/services/${serviceId}`);
        // return response.status === 200 ? true : false;
    } catch (error) {
        throw new ErrorResponse(
            'DockerError',
            error.message,
            error.response.status,
        );
    }
}

module.exports.generateDockerfile = async (
    imageContext,
    {
        repoTag,
        workDir,
        exposedPort,
        cmdCommand,
        runCommand,
    },
) => {
    try {
        let dockerfile = await fsPromises.readFile(
            path.join(DOCKER_PATH, 'Dockerfile'),
            'utf8',
        );

        dockerfile = dockerfile.replace(
            /REPO_TAG/,
            repoTag,
        );
        dockerfile = dockerfile.replace(
            /IMAGE_WORK_DIR/,
            workDir,
        );
        dockerfile = dockerfile.replace(
            /EXPOSE_PORT/,
            exposedPort,
        );
        cmdCommand
            ? (dockerfile = dockerfile.replace(
                  /#CMD_COMMAND/,
                  cmdCommand,
              ))
            : '';
        runCommand
            ? (dockerfile = dockerfile.replace(
                  /#RUN_COMMAND/,
                  runCommand,
              ))
            : '';

        await fsPromises.writeFile(
            path.join(imageContext, 'Dockerfile'),
            dockerfile,
            'utf8',
        );
    } catch (error) {
        throw new ImageGenerateDockerfileError(error);
    }
};

module.exports.buildImage = async (imageContext, tag) => {
    try {
        let buildProgress = await docker.buildImage(
            {
                context: imageContext,
                src: ['Dockerfile'],
            },
            {
                t: tag,
            },
        );
        let dockerImageId = await new Promise(
            (resolve, reject) => {
                docker.modem.followProgress(
                    buildProgress,
                    (error, result) =>
                        error
                            ? reject(error)
                            : resolve(result),
                );
            },
        );

        return dockerImageId;
    } catch (error) {
        throw new ImageBuildError(error);
    }
};

module.exports.inspectImage = async (id) => {
    try {
        let image = new Dockerode.Image(docker.modem, id);
        return await image.inspect();
    } catch (error) {
        throw new ImageInspectError(error);
    }
};

module.exports.listImages = async () => {
    try {
        return await docker.listImages();
    } catch (error) {
        throw new ListImagesError(error);
    }
};
