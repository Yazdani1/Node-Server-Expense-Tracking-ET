const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var expenseBookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },

  color: {
    type: String,
    enum: ["Orange", "Green", "Yellow"],
    default: "Orange",
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

module.exports = mongoose.model("ExpenseBook", expenseBookSchema);
