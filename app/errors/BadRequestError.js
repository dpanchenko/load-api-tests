const HttpStatus = require('http-status-codes');
const AbstractError = require('./AbstractError');

class BadRequestError extends AbstractError {
  constructor(message, data) {
    super(message, data, HttpStatus.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
