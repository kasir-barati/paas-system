const path = require('path');
const crypto = require('crypto');
const { promises: fsPromises } = require('fs');

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

class InspectServiceError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

class CreateServiceError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

class ListNetworkError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

class CreateNetworkError extends ErrorResponse {
    constructor(message) {
        super('DockerError', message, 500);
    }
}

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

module.exports.inspectService = async (id) => {
    try {
        let inspectService = await docker
            .getService(id)
            .inspect();

        return inspectService.data;
    } catch (error) {
        throw new InspectServiceError(error);
    }
};

module.exports.createService = async (
    hostname,
    image,
    cpu,
    ram,
    env = [''],
) => {
    try {
        switch (image.imageRepoTags[0].split(':')) {
            case 'mariadb':
            case 'mysql': {
                env.push(
                    `MYSQL_ROOT_PASSWORD=${crypto
                        .randomBytes(8)
                        .toString('hex')}`,
                );
                env.push(
                    `MYSQL_DATABASE=${crypto
                        .randomBytes(4)
                        .toString('hex')}`,
                );
                break;
            }
        }

        let service = await docker.createService({
            TaskTemplate: {
                ContainerSpec: {
                    Image: image.imageRepoTags[0],
                    Env: env,
                    Hostname: hostname,
                },
                Resources: {
                    Limits: {
                        NanoCPUs: cpu * 1_000_000_000,
                        MemoryBytes: ram * 1_073_741_824,
                    },
                },
            },
            EndpointSpec: {
                Mode: 'vip',
                Ports: [
                    {
                        Protocol: 'tcp',
                        TargetPort: image.imageExposedPort,
                    },
                ],
            },
        });

        return service.data.ID;
    } catch (error) {
        throw new CreateServiceError(error);
    }
};

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

// module.exports.createNetwork = async () => {
//     try {
//         let network = await docker.createNetwork({
//             Ingress: false,
//             Internal: false,
//             Attachable: true,
//             Driver: 'overlay',
//             EnableIPv6: false,
//             CheckDuplicate: true,
//             Name: crypto.randomBytes(16).toString('hex'),
//         });

//         return network.data.Id;
//     } catch (error) {
//         throw new CreateNetworkError(error.message);
//     }
// };

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

// module.exports.checkNetworkExistance = async (id) => {
//     try {
//         let network = docker.listNetworks({
//             filters: {
//                 id: ['09d77b180eab'],
//             },
//         });
//         return response.data.length > 0 ? true : false;
//     } catch (error) {
//         throw new ListNetworkError(message);
//     }
// };

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
            /REPO_TAG/g,
            repoTag,
        );
        dockerfile = dockerfile.replace(
            /IMAGE_WORK_DIR/g,
            workDir,
        );
        dockerfile = dockerfile.replace(
            /EXPOSE_PORT/g,
            exposedPort,
        );
        cmdCommand
            ? (dockerfile = dockerfile.replace(
                  /#CMD_COMMAND/g,
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
        let imageBuildingStreamArray = await new Promise(
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

        return tag;
    } catch (error) {
        throw new ImageBuildError(error);
    }
};

module.exports.inspectImage = async (id) => {
    try {
        console.log(id);
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
