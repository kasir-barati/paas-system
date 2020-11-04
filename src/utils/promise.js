module.exports.middlewareHandler = fn => (req, res, next) => 
    Promise
        .resolve(fn(req, res, next))
        .catch(next);

module.exports.promiseHandler = promise => 
    promise
        .then(data => [null, data])
        .catch(error => [error]);