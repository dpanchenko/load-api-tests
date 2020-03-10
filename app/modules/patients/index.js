const router = require('./router');
const service = require('./service');

module.exports = {
  init: (app) => {
    app.use('/patients', router);
  },
  service,
};
