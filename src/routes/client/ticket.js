const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { asyncMiddlewareHandler } = require('../../utils/promise');
const ticketController = require('../../controllers/client/ticket');
const ticketValidator = require('../../validators/client/ticket');

// /client/api/v1/tickets
router
    .route('/')
    .all(asyncMiddlewareHandler(isUser))
    .post(asyncMiddlewareHandler(ticketValidator.postTicket), asyncMiddlewareHandler(ticketController.postTicket))
    .get(asyncMiddlewareHandler(ticketValidator.getTickets), asyncMiddlewareHandler(ticketController.getTickets));

router
    .route('/:id')
    .all(asyncMiddlewareHandler(isUser))
    .get(asyncMiddlewareHandler(ticketValidator.getTicket), asyncMiddlewareHandler(ticketController.getTicket))
    .put(asyncMiddlewareHandler(ticketValidator.putTicket), asyncMiddlewareHandler(ticketController.putTicket))
    .delete(asyncMiddlewareHandler(ticketValidator.deleteTicket), asyncMiddlewareHandler(ticketController.deleteTicket));

module.exports = router;