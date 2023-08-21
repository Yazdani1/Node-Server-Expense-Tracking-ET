const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

var jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  des: {
    type: String,
    required: true,
  },

  jobCity: {
    type: String,
    required: true,
  },
  jobSkills: {
    type: [String],
    required: true,
  },

  visibility: {
    type: String,
    enum: ['Private', 'Public'],
    default: 'Public',
  },

  status: {
    type: String,
    enum: ['Panding', 'Approved'],
    default: 'Panding',
  },

  totalApplication: {
    type: Number,
    default: 0,
  },

  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },

  approvedBy: {
    type: ObjectId,
    ref: 'User',
  },

  approvedDate: {
    type: Date,
  },

  postedBy: {
    type: ObjectId,
    ref: 'User',
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobSchema', jobSchema);
