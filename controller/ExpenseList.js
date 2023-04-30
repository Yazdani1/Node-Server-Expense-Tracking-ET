const ObjectId = require("mongoose").Types.ObjectId;

const ExpenseList = require("../model/ExpenseList");

/**
 * To create expense List for each expense book
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createExpenseList = async (req, res) => {
  try {
    const { title, amount, expense_book_id, expense_category } = req.body;

    const expenseListDetails = ExpenseList({
      title,
      amount,
      expense_book_id,
      expense_category,
      postedBy: req.user,
    });
    const saveExpenseList = await ExpenseList.create(expenseListDetails);
    res.status(201).json(saveExpenseList);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To delete expense list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteExpenseListItem = async (req, res) => {
  try {
    const deleteQuery = { _id: req.params.id };

    const singleExpenseList = await ExpenseList.findById(deleteQuery);

    if (!singleExpenseList) {
      return res
        .status(422)
        .json({ error: "Expense list item could not found" });
    }
    const logedInUserId = req.user._id;
    const singleUserid = singleExpenseList.postedBy._id.toString();
    // to match if loged in user id and espense list postedby id same then only we can delete a single expense list
    if (logedInUserId === singleUserid) {
      const deleteSingleExpenseList = await ExpenseList.findByIdAndDelete(
        deleteQuery
      );
      res.status(200).json(deleteSingleExpenseList);
    } else {
      return res
        .status(422)
        .json({ error: "You can't delete other users expense list" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * // to count how much a user has spent. all the expenses ammount will be counted from any expense book
   //or expense list that a user hase created. First it filter user post based on their loged in id then count
   // all the expenses amount,.,
 * @param {*} req 
 * @param {*} res 
 */
exports.getTotalExpensesForEachUser = async (req, res) => {
  try {
    const totalExpensesbyUser = await ExpenseList.aggregate([
      // match is used to get all the TPI based on each WM ID
      // { $match: { postedBy: ObjectId("63af4dd94bc3360297a18fab")} },
      { $match: { postedBy: ObjectId(req.user._id) } },
      {
        $group: {
          _id: "$postedBy",
          totalammount: { $sum: "$amount" },
        },
      },
    ]);
    // to count each user user total expenses
    const userTotalExpensesCountByDate = await ExpenseList.aggregate([
      // match is used to match any particular field. For example where we want to match loged in user id with the Expenselist user id
      { $match: { postedBy: ObjectId(req.user._id) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          TotalExpenses: { $sum: "$amount" },
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.status(200).json({ totalExpensesbyUser, userTotalExpensesCountByDate });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
