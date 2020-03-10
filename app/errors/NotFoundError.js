const HttpStatus = require('http-status-codes');
const AbstractError = require('./AbstractError');

class NotFoundError extends AbstractError {
  constructor(message, data) {
    super(message, data, HttpStatus.NOT_FOUND);
  }
}

module.exports = NotFoundError;
