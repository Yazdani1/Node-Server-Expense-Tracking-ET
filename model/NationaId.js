const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


var nationalIdSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  nationalIdNumber: {
    type: Number,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },

  city:{
    type: String,
    required: true,
  },

  fatherName:{
    type: String,
    required: true,
  },

  motherName:{
    type: String,
    required: true,
  },
  street:{
    type: String,
    required: true,
  },
  houseNumber:{
    type: Number,
    required: true,
  },
  postalCode:{
    type: Number,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },

  date: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("NationalId", nationalIdSchema);
