module.exports.asyncMiddlewareHandler = fn => (req, res, next) => 
    Promise
        .resolve(fn(req, res, next))
        .catch(next);
