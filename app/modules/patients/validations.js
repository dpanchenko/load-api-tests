const joi = require('joi');

const paginatorValidation = {
  headers: {
    'x-offset': joi.string().regex(/^\d+$/).default('0'),
    'x-limit': joi.string().regex(/^\d+$/).default('10'),
  },
};

const idValidation = {
  params: {
    memberId: joi.string().regex(/^\d+$/).required(),
  },
};

const importPathValidation = {
  file: joi.object().keys({
    path: joi.string().required(),
  }).required(),
};

module.exports = {
  idValidation,
  paginatorValidation,
  importPathValidation,
};
