const logger = require('../../helpers/logger');
const reader = require('../../helpers/reader');
const patientModel = require('./models/patient');
const emailModel = require('./models/email');
const InternalServerError = require('../../errors/InternalServerError');
const NotFoundError = require('../../errors/NotFoundError');

const { parseHeader, parseLine } = require('../../lib/parser');

const importData = async (fileName) => {
  try {
    let headerParsed = false;
    let count = 0;
    const dbCommands = [];

    await reader(fileName, async (line) => {
      if (!headerParsed) {
        headerParsed = true;
        parseHeader(line);
        return;
      }

      const { patient, emails } = parseLine(line);

      try {
        dbCommands.push(patientModel.create(patient));

        if (emails) {
          dbCommands.push(emailModel.insertMany(emails));
        }

        count += 1;
      } catch (err) {
        logger.error(`Error insert patient to database: ${err.message}`);
      }
    });

    // Lets wait untill all insert commands will be done
    await Promise.all(dbCommands);

    return { count };
  } catch (err) {
    logger.error(`Import patients failed with message: ${err.message}`);

    throw new InternalServerError('Import patients failed');
  }
};

const getList = async (offset, limit) => {
  const [count, items] = await Promise.all([
    patientModel.count().exec(),
    patientModel.find().select('-_id -__v').skip(offset).limit(limit).exec(), // eslint-disable-line
  ]);

  return { count, items };
};

const getPatient = async (memberId) => {
  let emails;
  const result = await patientModel.findOne({ memberId }).select('-_id -__v').exec();

  if (!result) {
    throw new NotFoundError('Patient not found', { memberId });
  }

  if (result.consent) {
    emails = await emailModel.find({ memberId }).select('-_id -__v -memberId').exec();
  }

  return {
    ...result.toJSON(),
    emails,
  };
};

module.exports = {
  importData,
  getList,
  getPatient,
};
