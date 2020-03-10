class AbstractError extends Error {
  constructor(message, data, statusCode) {
    super(message);

    this._data = data;
    this._statusCode = statusCode;
  }

  get code() {
    return this.constructor.name;
  }

  get data() {
    return this._data;
  }

  get statusCode() {
    return this._statusCode;
  }
}

module.exports = AbstractError;
