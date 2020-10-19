const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { asyncMiddlewareHandler } = require('../../utils/promise');
const paymentController = require('../../controllers/client/payment.js');
const paymentValidator = require('../../validators/client/payment');

// /client/api/v1/payments
router
    .route('/')
    .all(asyncMiddlewareHandler(isUser))
    .post(asyncMiddlewareHandler(paymentValidator.postPayment), asyncMiddlewareHandler(paymentController.postPayment))
    .get(asyncMiddlewareHandler(paymentController.getPayments));

router
    .route('/:id')
    .all(asyncMiddlewareHandler(isUser))
    .get(asyncMiddlewareHandler(paymentValidator.paymentVerification), asyncMiddlewareHandler(paymentController.paymentVerification));

module.exports = router;