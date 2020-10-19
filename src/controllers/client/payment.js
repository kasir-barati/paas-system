// const ZarinpalCheckout = require('zarinpal-checkout')
const ZarinpalGateway = require('zarinpal-gateway');

const User = require('../../models/user');
const UserPayment = require('../../models/user-payment');
const ErrorResponse = require('../../utils/error-response');
const { promiseHandler } = require('../../utils/promise');
// const zarinpal = ZarinpalCheckout.create(process.env.MERCHENT_CODE, true);
const zarinpal = new ZarinpalGateway(process.env.MERCHENT_CODE, true)

module.exports.postPayment = async (req, res, next) => {
    let { userId } = req;
    let { amount } = req.body;
    let user = await User.findByPk(userId);
    // let [resError, resData] = await promiseHandler(zarinpal.PaymentRequest({
    //     Amount: Number(amount),
    //     CallbackURL: process.env.UI_PAYMENT_CALLBACK,
    //     Description: 'شارژ اکانت',
    //     Email: user.email,
    //     Mobile: user.phone
    // }));
    let authority = await zarinpal.requestPayment({
        amount:"5000", 
        description:"test",
        callbackUrl: process.env.UI_PAYMENT_CALLBACK,
    });
    let redirect = zarinpal.startPayUrl + authority;
    if (resError) return next(new ErrorResponse('PaymentFailed', resError, 500));
    console.log('\n\n\n', resData);
    // you should save response.RefID
    // if (response.RefID) save it
    // else think what you can do

    let userPayment = await UserPayment.create({
        amount,
        userId: userId
    });

    if (response.status !== 100) return next(next(new ErrorResponse('PaymentError', `Payment was not successful.`, 400)));
    req.apiError = null;
    req.apiStatus = 200;
    req.apiData = resData.url;
    next();
};

module.exports.getPayments = async (req, res, next) => {
    let { userId } = req;
    let userPayments = await UserPayment.findAll({
        where: {
            id: userId
        }
    });

    req.apiStatus = 200;
    req.apiData = userPayments;
    req.apiError = null;
    next();
};

module.exports.paymentVerification = async (req, res, next) => {
    let { id } = req;
    let { authority } = req.body;
    let userPayment = await UserPayment.findByPk(id);
    let user = await User.findByPk(userPayment.userId);
    // const authority = req.originalUrl.split('?')[1].split('&')[0].split('=')[1];
    let response = await zarinpal.PaymentVerification({
        Amount: userPayment.amount,
        Authority: authority
    });

    if (response.status !== 100) return next(new ErrorResponse('PaymentVerificationFailed', `Payment verification failed, ${userPayment.id}`, 200));

    userPayment.status = true;
    userPayment.refId = response.RefID;
    await userPayment.save();
    user.balance = Number(user.balance) + Number(userPayment.amount);
    await user.save();

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};