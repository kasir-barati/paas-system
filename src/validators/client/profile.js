const ErrorResponse = require('../../utils/error-response');
const passwordUtil = require('../../utils/password');
const validator = require('../../utils/validator');
const User = require('../../models/user');

class UpdatePasswordError extends ErrorResponse {
    constructor(message) {
        super('validationError', message, 400);
    }
}

class UpdateProfileError extends ErrorResponse {
    constructor(message) {
        super('ValidationError', message, 400);
    }
}

module.exports.updateProfile = async (req, res, next) => {
    let { name, phone, avatar } = req.body;
    let errorMessage = [];

    !validator.isAlpha(name)
        ? errorMessage.push("Name isn't valid")
        : '';
    !validator.isUrl(avatar)
        ? errorMessage.push("Avatar isn't valid")
        : '';
    !validator.isNumeric(phone)
        ? errorMessage.push("Phone isn't valid")
        : '';

    errorMessage.length
        ? next(
              new UpdateProfileError(
                  errorMessage.join('|'),
              ),
          )
        : next();
};

module.exports.updatePassword = async (
    req,
    res,
    next,
) => {
    let { id } = req.user;
    let errorMessage = [];
    let user = await User.findByPk(id);
    let { newPassword, oldPassword } = req.body;

    if (
        !(await passwordUtil.compare(
            oldPassword,
            user.hashedPassword,
            user.saltPassword,
        ))
    ) {
        errorMessage.push('Entered old password is wrong');
    } else {
        !validator.isPassword(newPassword)
            ? errorMessage.push(
                  'New password does not fulfill requirements.',
              )
            : '';
    }
    errorMessage.length
        ? next(
              new UpdatePasswordError(
                  errorMessage.join('|'),
              ),
          )
        : next();
};
