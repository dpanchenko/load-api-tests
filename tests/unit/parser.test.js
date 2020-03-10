/* eslint-disable prefer-arrow-callback */
const { expect } = require('chai');
const {
  parseHeader,
  parseLine,
} = require('../../app/lib/parser');
const ParserError = require('../../app/errors/ParserError');
const {
  CORRECT_HEADER_1,
  CORRECT_HEADER_2,
  WRONG_HEADER_1,
  WRONG_HEADER_2,
  WRONG_HEADER_3,
  CORRECT_LINE_WITH_CONSENT_Y,
  CORRECT_LINE_WITH_CONSENT_N,
  CORRECT_LINE_WITH_EMPTY_FIELDS,
  WRONG_LINE_WITH_INCOMPATIBLE_FORMAT,
  WRONG_LINE_WITH_EMPTY_MEMBER_ID,
  WRONG_LINE_WITH_WRONG_PROGRAM_ID,
  WRONG_LINE_WITH_WRONG_CARD_NUMBER,
  WRONG_LINE_WITH_WRONG_MEMBER_ID,
  WRONG_LINE_WITH_WRONG_DATE_OF_BIRTH,
  WRONG_LINE_WITH_WRONG_STATE,
  WRONG_LINE_WITH_WRONG_ZIP_CODE,
  WRONG_LINE_WITH_WRONG_EMAIL,
  PARSED_PATIENT_WITH_CONSENT_Y,
  PARSED_PATIENT_EMAILS,
  PARSED_PATIENT_WITH_CONSENT_N,
  PARSED_PATIENT_WITH_EMPTY_VALUES,
} = require('./fixtures');

describe('Parser library tests', function () {
  describe('parseHeader method', function () {
    it('exact header should be parsed successfully', function () {
      const result = parseHeader(CORRECT_HEADER_1);

      expect(result).to.equal(true);
    });

    it('header with additional fileds at the end should be parsed successfully', function () {
      const result = parseHeader(CORRECT_HEADER_2);

      expect(result).to.equal(true);
    });

    it('header started with wrong column should throw error', function () {
      expect(() => parseHeader(WRONG_HEADER_1)).to.throw(ParserError, 'Header incompatible format');
    });

    it('header without some mandatory columns should throw error', function () {
      expect(() => parseHeader(WRONG_HEADER_2)).to.throw(ParserError, 'Header incompatible format');
    });

    it('header with some some mandatory columns should throw error', function () {
      expect(() => parseHeader(WRONG_HEADER_3)).to.throw(ParserError, 'Header incompatible format');
    });
  });
  describe('parseLine method', function () {
    it('correct values with consent="Y" should return parsed data with emails', function () {
      const result = parseLine(CORRECT_LINE_WITH_CONSENT_Y);

      expect(result).to.have.property('patient');
      expect(result).to.have.property('emails');
      expect(result.patient).to.deep.equal(PARSED_PATIENT_WITH_CONSENT_Y);
      expect(result.emails).to.deep.equal(PARSED_PATIENT_EMAILS);
    });

    it('correct values with consent="N" should return parsed data without emails', function () {
      const result = parseLine(CORRECT_LINE_WITH_CONSENT_N);

      expect(result).to.have.property('patient');
      expect(result).to.have.property('emails');
      expect(result.patient).to.deep.equal(PARSED_PATIENT_WITH_CONSENT_N);
      expect(result.emails).to.deep.equal(null);
    });

    it('empty values should return parsed data with empty values', function () {
      const result = parseLine(CORRECT_LINE_WITH_EMPTY_FIELDS);

      expect(result).to.have.property('patient');
      expect(result).to.have.property('emails');
      expect(result.patient).to.deep.equal(PARSED_PATIENT_WITH_EMPTY_VALUES);
      expect(result.emails).to.deep.equal(null);
    });

    it('line with incompatible format should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_INCOMPATIBLE_FORMAT)).to.throw(ParserError, 'Data line has incompatible format');
    });

    it('line with empty memeber id should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_EMPTY_MEMBER_ID)).to.throw(ParserError);
    });

    it('line with wrong program id should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_PROGRAM_ID)).to.throw(ParserError);
    });

    it('line with wrong card number should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_CARD_NUMBER)).to.throw(ParserError);
    });

    it('line with wrong member id should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_MEMBER_ID)).to.throw(ParserError);
    });

    it('line with wrong date of birth should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_DATE_OF_BIRTH)).to.throw(ParserError);
    });

    it('line with wrong state should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_STATE)).to.throw(ParserError);
    });

    it('line with wrong zip code should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_ZIP_CODE)).to.throw(ParserError);
    });

    it('line with wrong email should throw error', function () {
      expect(() => parseLine(WRONG_LINE_WITH_WRONG_EMAIL)).to.throw(ParserError);
    });
  });
});
