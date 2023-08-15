const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

var courseEnrollmentSchema = mongoose.Schema({
  courseInstructorId: {
    type: ObjectId,
    ref: 'User',
  },

  courseId: {
    type: ObjectId,
    ref: 'CourseSchema',
    required: true,
  },

  coupon: {
    type: String,
    required: true,
  },

  enrolledBy: {
    type: ObjectId,
    ref: 'User',
  },

  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
