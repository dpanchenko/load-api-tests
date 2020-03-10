module.exports = {
  mongo: {
    url: 'mongodb://localhost:27017/integration-test-load-db',
    options: {
      auto_reconnect: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
};
