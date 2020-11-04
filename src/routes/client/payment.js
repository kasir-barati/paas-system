const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { middlewareHandler } = require('../../utils/promise');
const paymentValidator = require('../../validators/client/payment');
const paymentController = require('../../controllers/client/payment.js');

// /client/api/v1/payments
router
    .route('/')
    .all(middlewareHandler(isUser))
    .post(middlewareHandler(paymentValidator.postPayment), middlewareHandler(paymentController.postPayment))
    .get(middlewareHandler(paymentController.getPayments));

router
    .route('/:id')
    .all(middlewareHandler(isUser))
    .get(middlewareHandler(paymentValidator.paymentVerification), middlewareHandler(paymentController.paymentVerification));

module.exports = router;