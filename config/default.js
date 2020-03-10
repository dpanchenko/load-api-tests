const packageJson = require('../package.json');

module.exports = {
  app: {
    name: packageJson.name,
    version: packageJson.version,
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  logs: {
    level: process.env.LOGS_LEVEL || 'debug',
    isDevelopmentMode: process.env.LOGS_IS_DEVELOPMENT || false,
  },
  mongo: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/test_load_db',
    options: {
      auto_reconnect: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
  upload: {
    path: `${__dirname}/../tmp/`,
  },
};
