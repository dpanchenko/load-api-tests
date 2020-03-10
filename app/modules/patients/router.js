const config = require('config');
const express = require('express');
const validator = require('express-validation');
const multer = require('multer');

const sendResult = require('../../helpers/result');

const patientsService = require('./service');
const { idValidation, paginatorValidation, importPathValidation } = require('./validations');

const upload = multer({ dest: config.get('upload.path') });

const router = express.Router();

/**
 * @api {post} /patients/import Import patients
 * @apiDescription Import patients from flat file to local database.
 * @apiName ImportPatients
 * @apiGroup Patients
 *
 * @apiSuccess {Number} count count of imported posts.
 */
router.post('/import', upload.single('patients'), validator(importPathValidation), async (req, res) => {
  const result = await patientsService.importData(req.file.path);

  return sendResult(res, result);
});

/**
 * @api {get} /patients Get list
 * @apiDescription Get list of patients from local database. Support pagination.
 * @apiName PatientsList
 * @apiGroup Patients
 *
 * @apiHeader {Number} x-offset Pagination offset.
 * @apiHeader {Number} x-limit Pagination limit.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-offset": "10",
 *       "x-limit": "5"
 *     }
 *
 * @apiSuccess {Object} result Patients list result.
 * @apiSuccess {Number} result.count Count of all patients in DB.
 * @apiSuccess {Object[]} result.items List of patients.
 * @apiSuccess {String} result.items.memberId Member ID.
 * @apiSuccess {String} result.items.firstName First Name.
 * @apiSuccess {String} result.items.lastName Last name.
 * @apiSuccess {String} result.items.emailAddress Email Address.
 * @apiSuccess {Boolean} result.items.consent CONSENT.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "count": 18,
 *          "items": [
 *              {
 *                  "memberId": "12045",
 *                  "firstName": "LOAD",
 *                  "lastName": "TEST 1",
 *                  "emailAddress": "test1@humancaresystems.com",
 *                  "consent": true,
 *              },
 *              {
 *                  "memberId": "12045",
 *                  "firstName": "LOAD",
 *                  "lastName": "TEST 1",
 *                  "emailAddress": "test1@humancaresystems.com",
 *                  "consent": true,
 *              }
 *          ]
 *      }
*/
router.get('/', validator(paginatorValidation), async (req, res) => {
  const offset = parseInt(req.headers['x-offset'], 10);
  const limit = parseInt(req.headers['x-limit'], 10);

  const result = await patientsService.getList(offset, limit);

  return sendResult(res, result);
});

/**
 * @api {get} /patients/:id Get patient
 * @apiDescription Get patient data from local database by Member ID.
 * @apiName PatientInfo
 * @apiGroup Patients
 *
 * @apiParam {Number} id Patient Member ID.
 *
 * @apiSuccess {Object} result Patient data.
 * @apiSuccess {String} result.programId Program Identifier.
 * @apiSuccess {String} result.dataSource Data Source.
 * @apiSuccess {String} result.cardNumber Card Number.
 * @apiSuccess {String} result.memberId Member ID.
 * @apiSuccess {String} result.firstName First Name.
 * @apiSuccess {String} result.lastName Last name.
 * @apiSuccess {Date} result.dateOfBirth Date of Birth.
 * @apiSuccess {String} result.address1 Address 1.
 * @apiSuccess {String} result.address2 Address 2.
 * @apiSuccess {String} result.city City.
 * @apiSuccess {String} result.state State.
 * @apiSuccess {String} result.zipCode Zip code.
 * @apiSuccess {String} result.telephoneNumber Telephone number.
 * @apiSuccess {String} result.emailAddress Email Address.
 * @apiSuccess {Boolean} result.consent CONSENT.
 * @apiSuccess {String} result.mobilePhone Mobile Phone.
 * @apiSuccess {Object[]} result.emails Patient emails.
 * @apiSuccess {Number} result.emails.dayNumber Cadence day number.
 * @apiSuccess {Object} result.emails.data Email data.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "programId": "50777445",
 *          "dataSource": "WEB 3RD PARTY",
 *          "cardNumber": "564232340",
 *          "memberId": "12045",
 *          "firstName": "LOAD",
 *          "lastName": "TEST 1",
 *          "dateOfBirth": "1969-03-19T17:00:00.000Z",
 *          "address1": "3100 S Ashley Drive",
 *          "address2": "",
 *          "city": "Chandler",
 *          "state": "AZ",
 *          "zipCode": "85286",
 *          "telephoneNumber": "",
 *          "emailAddress": "test1@humancaresystems.com",
 *          "consent": true,
 *          "mobilePhone": "1234567890 ",
 *          "emails": [
 *              {
 *                  "dayNumber": 1
 *              },
 *              {
 *                  "dayNumber": 2
 *              },
 *              {
 *                  "dayNumber": 3
 *              },
 *              {
 *                  "dayNumber": 4
 *              }
 *          ]
 *      }
 */
router.get('/:memberId', validator(idValidation), async (req, res) => {
  const { memberId } = req.params;

  const result = await patientsService.getPatient(memberId);

  return sendResult(res, result);
});

module.exports = router;
