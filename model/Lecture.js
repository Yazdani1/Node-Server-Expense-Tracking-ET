const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

var lectureSchema = mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true,
  },

  lectureDes: {
    type: String,
    required: true,
  },

  courseId: {
    type: ObjectId,
    ref: 'CourseSchema',
    required: true,
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

module.exports = mongoose.model('LectureSchema', lectureSchema);
