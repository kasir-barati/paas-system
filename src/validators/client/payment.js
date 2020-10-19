let User = require('../../models/user');
let validator = require('../../utils/validator');
let UserPayment = require('../../models/user-payment');

module.exports.postPayment = async (req, res, next) => {
    let errorMessage = [];
    let { userId } = req;
    let { amount } = req.body;
    let user = await User.findByPk(userId);

    !user.phone.length === 0 ? errorMessage.push("Your phone number is wrong") : '';
    !validator.isNumeric(amount) ? errorMessage.push("Amount is wrong") : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};

module.exports.paymentVerification = async (req, res, next) => {
    let errorMessage = [];
    let { id } = req.params;

    !await UserPayment.findByPk(id) ? errorMessage.push('Payment id is wrong') : '';
    errorMessage.length ? next(new ErrorResponse('ValidationError', errorMessage.join('|'), 400)) : next();
};