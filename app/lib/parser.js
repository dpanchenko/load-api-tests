const joi = require('joi');
const ParserError = require('../errors/ParserError');

const patientSchema = joi.object({
  programId: joi.string().regex(/^\d+$/).allow('').required(),
  dataSource: joi.string().allow('').required(),
  cardNumber: joi.string().regex(/^\d+$/).allow('').required(),
  memberId: joi.string().regex(/^\d+$/).required(),
  firstName: joi.string().allow('').required(),
  lastName: joi.string().allow('').required(),
  dateOfBirth: joi.string().regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/).allow('').required(),
  address1: joi.string().allow('').required(),
  address2: joi.string().allow('').required(),
  city: joi.string().allow('').required(),
  state: joi.string().regex(/^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$/).allow('').required(),
  zipCode: joi.string().regex(/^\d{5}$/).allow('').required(),
  telephoneNumber: joi.string().regex(/^\d+$/).allow('').required(),
  emailAddress: joi.string().email().allow('').required(),
  consent: joi.boolean().required(),
  mobilePhone: joi.string().regex(/^\d+$/).allow('').required(),
});

const HEADER_PATTERN = 'Program Identifier|Data Source|Card Number|Member ID|First Name|Last Name|Date of Birth|Address 1|Address 2|City|State|Zip code|Telephone number|Email Address|CONSENT|Mobile Phone';

const parseHeader = (line) => {
  if (line.indexOf(HEADER_PATTERN) !== 0) {
    throw new ParserError('Header incompatible format');
  }

  return true;
};

const parseLine = (line) => {
  const parts = line.split('|');

  if (parts.length !== 16) {
    throw new ParserError('Data line has incompatible format');
  }

  const [
    programId,
    dataSource,
    cardNumber,
    memberId,
    firstName,
    lastName,
    dateOfBirth,
    address1,
    address2,
    city,
    state,
    zipCode,
    telephoneNumber,
    emailAddress,
    consent,
    mobilePhone,
  ] = parts;

  const patient = {
    programId,
    dataSource,
    cardNumber,
    memberId,
    firstName,
    lastName,
    dateOfBirth,
    address1,
    address2,
    city,
    state,
    zipCode,
    telephoneNumber,
    emailAddress,
    consent: consent === 'Y',
    mobilePhone,
  };

  const { error, value } = patientSchema.validate(patient);

  if (error) {
    throw new ParserError(error.message);
  }

  const emails = !value.consent ? null : [
    { memberId, dayNumber: 1, data: {} },
    { memberId, dayNumber: 2, data: {} },
    { memberId, dayNumber: 3, data: {} },
    { memberId, dayNumber: 4, data: {} },
  ];

  return {
    patient: value,
    emails,
  };
};

module.exports = {
  parseHeader,
  parseLine,
};
