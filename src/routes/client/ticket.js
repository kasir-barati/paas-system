const router = require('express').Router();

const {
    isAuthenticated,
} = require('../../middlewares/jwt');
const {
    middlewareHandler,
} = require('../../utils/promise');
const ticketController = require('../../controllers/client/ticket');
const ticketValidator = require('../../validators/client/ticket');

// /client/api/v1/tickets
router
    .route('/')
    .all(middlewareHandler(isAuthenticated))
    .post(
        middlewareHandler(ticketValidator.postTicket),
        middlewareHandler(ticketController.postTicket),
    )
    .get(
        middlewareHandler(ticketValidator.getTickets),
        middlewareHandler(ticketController.getTickets),
    );

router
    .route('/:id')
    .all(middlewareHandler(isAuthenticated))
    .get(
        middlewareHandler(ticketValidator.getTicket),
        middlewareHandler(ticketController.getTicket),
    )
    .put(
        middlewareHandler(ticketValidator.putTicket),
        middlewareHandler(ticketController.putTicket),
    )
    .delete(
        middlewareHandler(ticketValidator.deleteTicket),
        middlewareHandler(ticketController.deleteTicket),
    );

module.exports = router;
