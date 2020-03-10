const HttpStatus = require('http-status-codes');
const AbstractError = require('./AbstractError');

class InternalServerError extends AbstractError {
  constructor(message, data) {
    super(message, data, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = InternalServerError;
