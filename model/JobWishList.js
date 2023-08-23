const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

var jobWishListSchema = mongoose.Schema({
  jobPostPublishedBy: {
    type: ObjectId,
    ref: 'User',
  },

  jobPostId: {
    type: ObjectId,
    ref: 'JobSchema',
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

module.exports = mongoose.model('JobWishListSchema', jobWishListSchema);
