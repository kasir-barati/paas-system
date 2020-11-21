class ErrorResponse extends Error {
    constructor(name, message, statusCode) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    };
};

module.exports = ErrorResponse;