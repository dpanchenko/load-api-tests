const config  = require('config');
const winston = require('winston');

const LOG_LEVEL = config.get('logs.level');
const DEVELOPMENT_MODE = config.get('logs.isDevelopmentMode');

const { createLogger, format, transports } = winston;

const devModeFormat = format.combine(
  format.timestamp(),
  format.colorize(),
  format.simple(),
);

const prodModeFormat = format.combine(
  format.timestamp(),
  format.json(),
);

const logger = createLogger({
  format: DEVELOPMENT_MODE ? devModeFormat : prodModeFormat,
  defaultMeta: config.get('app'),
  transports: [
    new transports.Console({ level: LOG_LEVEL }),
  ],
});

module.exports = logger;
