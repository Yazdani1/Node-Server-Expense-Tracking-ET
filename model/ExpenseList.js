const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


var expenseListSchema = mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  amount:{
    type: Number,
    required: true,
  },

  expense_book_id:{
    type: ObjectId,
    ref: "ExpenseBook",
  },

  // expense_category:{
  //   type: ObjectId,
  //   ref: "ExpenseCategory",
  // },

  expense_category:{
    type: String,
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

module.exports = mongoose.model("ExpenseList", expenseListSchema);
