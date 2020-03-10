const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  programId: { type: String, require: true },
  dataSource: { type: String, required: true },
  cardNumber: { type: String, required: true },
  memberId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: Date },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  telephoneNumber: { type: String },
  emailAddress: { type: String },
  consent: { type: Boolean },
  mobilePhone: { type: String },
});

schema.index({ memberId: 1 });
schema.index({ email: 1 });
schema.index({ consent: 1, email: 1 });
schema.index({ firstName: 1 });

module.exports = mongoose.model('Patients', schema);
