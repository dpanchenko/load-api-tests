const config = require('config');
const app = require('./app');

process.title = config.get('app.name');

app.run();
