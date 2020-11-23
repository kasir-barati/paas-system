const path = require('path');
const { promises: fsPromises } = require('fs');

const { Op } = require('sequelize');
const { IncomingForm } = require('formidable');

const Image = require('../../models/image');
const dockerService = require('../../services/docker');

const DOCKER_PATH = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'docker',
);

module.exports.uploadProjectZipFile = async (
    req,
    res,
    next,
) => {
    let newImage = await Image.create({});
    let form = new IncomingForm({
        keepExtensions: true,
        uploadDir: DOCKER_PATH,
    });

    form.parse(req);
    form.on('fileBegin', async (name, file) => {
        let extractDir = path.join(
            DOCKER_PATH,
            newImage.id,
        );

        await fsPromises.mkdir(extractDir);
        await extractZip(file.path, { dir: extractDir });
        await fsPromises.rm(file.path);
    });
    form.on('error', next);
    form.on('end', () => {
        req.apiError = null;
        req.apiData = newImage.id;
        req.apiStatus = 200;
        next();
    });
};

module.exports.add = async (req, res, next) => {
    let { id } = req.body;
    let imageInspect = await dockerService.inspectImage(id);
    let insertedImage = await Image.create({
        imageId: imageInspect.Id,
        imageRepoTags: imageInspect.RepoTags,
        imageRepoDigests: imageInspect.RepoDigests,
        imageParentId: imageInspect.Parent,
        imageCreated: imageInspect.Created,
        imageContainer: imageInspect.Container,
        imageExposedPort:
            imageInspect.ContainerConfig.ExposedPorts,
        imageEnv: imageInspect.ContainerConfig.Env,
        imageCmd: imageInspect.ContainerConfig.Cmd,
        imageWorkDir:
            imageInspect.ContainerConfig.WorkingDir,
    });

    req.apiData = insertedImage.id;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.baseImagesList = async (req, res, next) => {
    let { type } = req.query;
    let selectImageCondition = [];

    switch (type) {
        case 'project': {
            // selectImageCondition = /node|php/;
            selectImageCondition = ['node', 'php'];
            break;
        }
        case 'database': {
            // selectImageCondition = /postgres|mysql|mariadb/;
            selectImageCondition = [
                'postgres',
                'mysql',
                'mariadb',
            ];
            break;
        }
        case 'prepared': {
            // selectImageCondition = /wordpress/;
            selectImageCondition = ['wordpress'];
            break;
        }
    }

    let images = await Image.findAndCountAll({
        where: {
            imageParentId: '',
            // imageRepoTags: {
            //     [Op.iLike]: {
            //         [Op.any]: selectImageCondition,
            //     },
            // },
        },
    });
    let list = [];
    let i = 0;

    for (let image of images.rows) {
        if (
            list.some(
                (item) =>
                    item.name ===
                    image.imageRepoTags?.[0].split(':')[0],
            )
        ) {
            list[
                list.findIndex(
                    (item) =>
                        image.imageRepoTags?.[0].split(
                            ':',
                        )[0],
                )
            ].versions.push({
                id: image.id,
                version: image.imageRepoTags[0].split(
                    ':',
                )[1],
            });
        } else {
            list.push({
                id: ++i,
                title: image.imageRepoTags?.[0].split(
                    ':',
                )[0],
                picUrl: image.picUrl,
                versions: [
                    {
                        id: image.id,
                        version: image.imageRepoTags[0].split(
                            ':',
                        )[1],
                    },
                ],
            });
        }
    }

    req.apiError = null;
    req.apiData = {
        list: list.filter((image) =>
            selectImageCondition.includes(image.title),
        ),
        paging: {
            totalCount: images.count,
            currentPage: 0,
            pageSize: 0,
            start: 0,
            end: 0,
        },
    };
    req.apiStatus = 200;
    next();
};

module.exports.build = async (req, res, next) => {
    let { baseImageId, newImageId } = req.body;
    let newImage = await Image.findByPk(newImageId);
    let baseImage = await Image.findByPk(baseImageId);
    let imageContext = path.join(DOCKER_PATH, newImageId);
    let newImageTag = `${
        baseImage.imageRepoTags[0].split(':')[0]
    }:${Date.now()}`;

    await dockerService.generateDockerfile(imageContext);

    let imageId = await dockerService.buildImage(
        imageContext,
        newImageTag,
    );
    let inspectImage = await dockerService.inspectImage(
        imageId,
    );

    newImage.imageId = inspectImage.Id;
    newImage.imageRepoTags = inspectImage.RepoTags;
    newImage.imageRepoDigests = inspectImage.RepoDigests;
    newImage.imageParentId = inspectImage.Parent;
    newImage.imageCreated = inspectImage.Created;
    newImage.imageContainer = inspectImage.Container;
    newImage.imageExposedPort =
        inspectImage.ContainerConfig.ExposedPorts;
    newImage.imageEnv = inspectImage.ContainerConfig.Env;
    newImage.imageCmd = inspectImage.ContainerConfig.Cmd;
    newImage.imageWorkDir =
        inspectImage.ContainerConfig.WorkingDir;
    newImage.ImageId = baseImageId;
    await newImage.save();

    req.apiData = newImageId;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};
