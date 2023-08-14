const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

var courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  des: {
    type: String,
    required: true,
  },

  enrolledStudents: {
    type: Number,
    default: 0,
  },

  maxStudents: {
    type: Number,
    required: true,
    default: 0,
  },

  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
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

module.exports = mongoose.model('CourseSchema', courseSchema);
