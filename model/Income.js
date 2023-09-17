const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var incomeSchema = mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  des: {
    type: String,
    required: true,
  },

  amount:{
    type: Number,
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
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("IncomeSchema", incomeSchema);
