const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  memberId: { type: String, require: true },
  dayNumber: { type: Number, require: true },
  data: { type: mongoose.Schema.Types.Mixed },
});

schema.index({ memberId: 1 });
schema.index({ day: 1 });

module.exports = mongoose.model('Emails', schema);
