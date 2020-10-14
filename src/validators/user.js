module.exports.getUsers = async (req, res, next) => {
    // validate request body
    // now i have 2 options
    // 1. next(error) & handle it in the express error handler
    // 2. req.apiError
};

module.exports.createUser = async (req, res, next) => { };

module.exports.getUser = async (req, res, next) => { };

module.exports.updateUser = async (req, res, next) => { };
module.exports.deleteUser = async (req, res, next) => { };