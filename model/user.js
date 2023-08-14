const mongoose = require('mongoose');

const validAwardTypes = ['PullShark', 'QuickDraw', 'Yolo', 'GoldVolt'];

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
  },
  imageUrl: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Subscriber', 'Instructor'],
    default: 'Subscriber',
  },
  award: {
    type: [
      {
        type: String,
        enum: validAwardTypes,
      },
    ],
  },

  accountType: {
    type: String,
    enum: ['Silver', 'Gold', 'Premium'],
    default: 'Silver',
  },
  blockUser: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
  },
  countryName: {
    type: String,
  },
  continent: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  resetToken: String,
  expireToken: Date,
});

module.exports = mongoose.model('User', userSchema);
