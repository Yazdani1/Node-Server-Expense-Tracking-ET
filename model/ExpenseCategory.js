const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


var expenseCategorySchema = mongoose.Schema({

  category_name: {
    type: String,
    required: true,
  },

  expense_book_id:{
    type: ObjectId,
    ref: "ExpenseBook",
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

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);
