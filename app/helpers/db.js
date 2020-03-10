const config = require('config');
const mongoose = require('mongoose');
const logger = require('./logger');

mongoose.Promise = global.Promise;
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

const mongoUrl = config.get('mongo.url');
const mongoOptions = config.get('mongo.options');

if (!mongoUrl) {
  throw new Error('Mongoose connection error');
}

mongoose.connection.on('error', () => {
  logger.error('Mongoose connection error');
});

module.exports = {
  connect: async () => {
    await mongoose.connect(mongoUrl, mongoOptions);

    return mongoose.connection;
  },
};
