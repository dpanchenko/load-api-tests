module.exports = {
  mongo: {
    url: 'mongodb://localhost:27017/integration-test-db',
    options: {
      auto_reconnect: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
};
