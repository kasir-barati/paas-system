const Image = require('../../models/image');
const ErrorResponse = require('../../utils/error-response');

class BuildError extends ErrorResponse {
    constructor(message) {
        super('ValidationError', message, 400);
    }
}

module.exports.build = async (req, res, next) => {
    let errorMessage = [];
    let { baseImageId, newImageId } = req.body;
    let newImage = await Image.findByPk(newImageId);
    let baseImage = await Image.findByPk(baseImageId);

    !newImage
        ? errorMessage.push('Wrong new image id')
        : '';
    !baseImage
        ? errorMessage.push('Wrong base image id')
        : '';
    errorMessage.length
        ? next(new BuildError(errorMessage.join('|')))
        : next();
};
