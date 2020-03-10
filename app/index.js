const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./helpers/expressAsyncErrors');

const db = require('./helpers/db');
const logger = require('./helpers/logger');
const sendResult = require('./helpers/result');
const patientsModule = require('./modules/patients');

const app = express();

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public`));

// Modules initializations
patientsModule.init(app);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'ValidationError') {
    err.code = err.name;
    err.statusCode = err.status;
    err.message = `Validation error: ${err.errors.map(error => error.messages.join('; ')).join('; ')}`;
  }

  if (!err.code) {
    logger.error(`Unexpected server error: ${err.message}`, err);
  }

  sendResult(res, err.data, err.message, err.statusCode || err.status);
});

module.exports = {
  run: async () => {
    await db.connect();

    app.listen(config.server.port, () => {
      logger.debug(`${config.app.name} v${config.app.version} started`);
      logger.debug(`waiting connections on http://0.0.0.0:${config.server.port}`);
    });
  },
};
