const dockerService = require('../services/docker');

module.exports = async (Image, userId) => {
    for (let image of await dockerService.listImages()) {
        if (
            !image.RepoTags?.[0]
                .split(':')[0]
                .match(/php|node|postgres/) &&
            !image.RepoTags?.[0].split(':')[1]
        ) {
            continue;
        }

        let inspectImage = await dockerService.inspectImage(
            image.Id,
        );

        await Image.create({
            imageId: inspectImage.Id,
            imageRepoTags: inspectImage.RepoTags,
            imageRepoDigests: inspectImage.RepoDigests,
            imageParentId: inspectImage.Parent,
            imageCreated: inspectImage.Created,
            imageContainer: inspectImage.Container,
            imageExposedPort: inspectImage.ContainerConfig
                .ExposedPorts
                ? Object.keys(
                      inspectImage.ContainerConfig
                          .ExposedPorts,
                  )[0].split('/')[0]
                : 0,
            imageEnv: inspectImage.ContainerConfig.Env,
            imageCmd: inspectImage.ContainerConfig.Cmd,
            imageWorkDir:
                inspectImage.ContainerConfig.WorkingDir,
            userId,
        });
    }
};
