const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { asyncMiddlewareHandler } = require('../../utils/promise');
const ticketController = require('../../controllers/client/ticket');
const ticketValidator = require('../../validators/client/ticket');

// /client/api/v1/tickets
router
    .route('/')
    .post(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(ticketValidator.postTicket), asyncMiddlewareHandler(ticketController.postTicket))
    .get(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(ticketValidator.getTickets), asyncMiddlewareHandler(ticketController.getTickets));

router
    .route('/:id')
    .get(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(ticketValidator.getTicket), asyncMiddlewareHandler(ticketController.getTicket))
    .put(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(ticketValidator.putTicket), asyncMiddlewareHandler(ticketController.putTicket))
    .delete(asyncMiddlewareHandler(isUser), asyncMiddlewareHandler(ticketValidator.deleteTicket), asyncMiddlewareHandler(ticketController.deleteTicket));

module.exports = router;