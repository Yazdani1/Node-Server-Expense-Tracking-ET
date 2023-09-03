const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

var jobApplicationSchema = mongoose.Schema({
  jobPostOwnerId: {
    type: ObjectId,
    ref: 'User',
  },

  jobPostId: {
    type: ObjectId,
    ref: 'JobSchema',
  },

  status: {
    type: String,
    enum: ['Applied', 'InReview', 'NotFit', 'ShortListed'],
    default: 'Applied',
  },

  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },

  jobAppliedBy: {
    type: ObjectId,
    ref: 'User',
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
