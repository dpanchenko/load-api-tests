module.exports = function (res, data = {}, error, status) {
  const responseStatus = status || (error && 500) || 200;
  const responseBody = error ? { error } : data;

  res.status(responseStatus);

  return res.json(responseBody);
};
