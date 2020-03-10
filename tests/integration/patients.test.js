/* eslint-disable prefer-arrow-callback */
const { expect } = require('chai');
const addContext = require('mochawesome/addContext');

const { service } = require('../../app/modules/patients');
const db = require('../../app/helpers/db');
const reader = require('../../app/helpers/reader');
const { parseLine } = require('../../app/lib/parser');

const { SAMPLE_FILE } = require('./fixtures');

const getSampleEmailsForMember = memberId => [
  { memberId, day: 1 },
  { memberId, day: 2 },
  { memberId, day: 3 },
  { memberId, day: 4 },
];

describe('Patients integration tests', function () {
  let dbConnection;
  let importResult;
  let dataFromFile;
  let dataWithEmptyName;
  let dataWithEmptyEmailAndConsent;
  let dataWithConsent;

  const fileLines = [];

  // before running tests cases:
  // - initialize DB connection
  // - cleanup collections in test DB
  // - parse sample file and get data to memory
  before(async function () {
    dbConnection = await db.connect();

    const collections = await dbConnection.db.collections();

    for (const collection of collections) {
      await collection.deleteOne(); // eslint-disable-line
    }

    let headerParsed = false;

    // getting data from smaple file to work raw data
    await reader(SAMPLE_FILE, (line) => {
      if (!headerParsed) {
        headerParsed = true;
        return;
      }

      fileLines.push(line);
    });

    // build sample data from file
    // parseLine functionality is 100% covered by unit tests
    dataFromFile = fileLines.map(line => parseLine(line));
    // get sample data with empty first name - only memberIds
    dataWithEmptyName = dataFromFile
      .filter(({ patient }) => !patient.firstName.length)
      .map(({ patient }) => patient.memberId);
    // get sample data with empty email and contest = 'Y' - only memberIds
    dataWithEmptyEmailAndConsent = dataFromFile
      .filter(({ patient }) => (!patient.firstName.length && patient.contest))
      .map(({ patient }) => patient.memberId);
    // get sample data with contest = 'Y' - only memberIds
    dataWithConsent = dataFromFile
      .filter(({ patient }) => patient.contest)
      .map(({ patient }) => patient.memberId);
  });

  it('sample file should be imported successfull', async function () {
    importResult = await service.importData(SAMPLE_FILE);
    expect(importResult).to.have.property('count');
    expect(importResult.count).to.be.above(1);
  });

  it('imported count should be equal to lines count in sample file', async function () {
    expect(importResult.count).to.equal(fileLines.length);
  });

  it('all lines from sample data present in DB', async function () {
    const checkedMembers = await Promise.all(dataFromFile.map(async ({ patient }) => {
      const { memberId } = patient;

      try {
        await service.getPatient(memberId);

        // patient present in DB
        return true;
      } catch (err) {
        // patient not present in DB
        return false;
      }
    }));

    const isAllMembersExist = checkedMembers.every(item => !!item);

    expect(checkedMembers.length).to.equal(fileLines.length);
    expect(isAllMembersExist).to.equal(true);
  });

  it('all patients with contest="Y" has emails created in DB and this emails has proper structure', async function () {
    await Promise.all(dataWithConsent.map(async (memberId) => {
      const result = await service.getPatient(memberId);

      expect(result).to.have.property('patient');
      expect(result).to.have.property('emails');

      expect(result.patient.memberId).to.equal(memberId);
      expect(result.emails).to.not.equal(null);

      expect(result.emails).to.deep.equal(getSampleEmailsForMember(memberId));
    }));
  });

  it('check patients with empty names', async function () {
    const { items } = await service.getList();
    const emptyNameItems = items.filter(item => !item.firstName.length).map(item => item.memberId);

    expect(emptyNameItems.length).to.equal(dataWithEmptyName.length);

    for (const memberId of emptyNameItems) {
      expect(dataWithEmptyName.includes(memberId)).to.equal(true);
    }

    addContext(this, `Patients mamberIds with empty FirstName: ${emptyNameItems.join(', ')}`);
  });

  it('check patients with empty email and contest="Y"', async function () {
    const { items } = await service.getList();

    const emptyEmailItems = items.filter(item => !item.emailAddress.length && item.contest).map(item => item.memberId);

    expect(emptyEmailItems.length).to.equal(dataWithEmptyEmailAndConsent.length);

    for (const memberId of emptyEmailItems) {
      expect(dataWithEmptyEmailAndConsent.includes(memberId)).to.equal(true);
    }

    addContext(this, `Patients mamberIds with empty Email Address but contest="Y": ${emptyEmailItems.join(', ')}`);
  });

  after(async function () {
    const collections = await dbConnection.db.collections();

    for (const collection of collections) {
      await collection.deleteOne(); // eslint-disable-line
    }

    await dbConnection.db.dropDatabase();
  });
});
