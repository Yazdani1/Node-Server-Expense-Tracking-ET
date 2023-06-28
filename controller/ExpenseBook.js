const slugify = require("slugify");
const uuid = require("uuid");

const ExpenseBook = require("../model/ExpenseBook");
const ExpenseCategory = require("../model/ExpenseCategory");
const ExpenseList = require("../model/ExpenseList");
const User = require("../model/user");

/**
 * To create expense book
 * @param {*} req
 * @param {*} res
 */
exports.createExpenseBook = async (req, res) => {
  try {
    const { name, color } = req.body;

    const expenseBookDetails = ExpenseBook({
      name,
      color,
      slug: uuid.v4(),
      postedBy: req.user,
    });

    const saveExpenseBook = await ExpenseBook.create(expenseBookDetails);

    // To add points in the user profile after creating a single expense book
    if (saveExpenseBook) {
      // When user create one expense book, we add point to the particulr user account.
      const addUserPoints = await User.findByIdAndUpdate(
        req.user._id,
        {
          $inc: { points: 5 },
        },
        { new: true }
      );
      res.status(201).json({ saveExpenseBook, addUserPoints });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To get all expense book list
 * @param {*} req
 * @param {*} res
 */
exports.getExpenseBookList = async (req, res) => {
  try {
    const expenseBookList = await ExpenseBook.find({ postedBy: req.user._id })
      .populate("postedBy", "name slug role")
      .sort({ date: -1 });

    res.status(200).json(expenseBookList);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To get expense book details, expense category and expense book item
 * @param {*} req
 * @param {*} res
 */
exports.getExpenseBookDetailsCategoryExpenseList = async (req, res) => {
  try {
    const singleExpenseBook_query = { slug: req.params.slug };

    // to get single expense book details
    const singleExpenseBook = await ExpenseBook.findOne(
      singleExpenseBook_query
    ).populate("postedBy", "name slug role _id");

    if (req.user._id === singleExpenseBook.postedBy._id.toString()) {
      // to get expense category for one expense book
      const expenseBookCategory = await ExpenseCategory.find({
        expense_book_id: singleExpenseBook._id,
        postedBy: req.user,
      })
        .populate("postedBy", "name slug role")
        .sort({ date: -1 });

      // to get expense list for one expense book

      const expenseList = await ExpenseList.find({
        expense_book_id: singleExpenseBook._id,
        postedBy: req.user,
      })
        .populate("expense_category", "category_name expense_book_id")
        .sort({ amount: -1 });

      // .sort({ amount: -1 }); means it will sort based on the amoun. -1 meanse larger value will show first then smaller
      // to group and count number of post for each category
      const totalExpenses = await ExpenseList.aggregate([
        // match is used to get all the Expense List based on each Expense Book
        { $match: { expense_book_id: singleExpenseBook._id } },
        {
          $group: {
            _id: "$expense_category",
            totalammount: { $sum: "$amount" },
          },
        },

        // {
        //   $lookup: {
        //     from: "expensecategories",
        //     localField: "expense_category",
        //     foreignField: "_id",
        //     as: "ExpenseCategoryName",
        //   },
        // },

        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "postedBy",
        //     foreignField: "_id",
        //     as: "Userfdgd",
        //   },
        // },
      ]);

      // to group by date and count number of posts have published based on each date from a collection

      const expenseListCountByDate = await ExpenseList.aggregate([
        // match is used to get all the TPI based on each WM ID
        { $match: { expense_book_id: singleExpenseBook._id } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 },
          },
        },
      ]);

      // to sum total expenses for each expense book
      const totalExpensesForEachExpenseBook = await ExpenseList.aggregate([
        // match is used to get all the TPI based on each WM ID
        { $match: { expense_book_id: singleExpenseBook._id } },
        {
          $group: {
            _id: "$expense_book_id",
            totalammount: { $sum: "$amount" },
          },
        },
      ]);

      // to sum number of  expenses list for each expense book
      const totalExpenseListPostCount = await ExpenseList.aggregate([
        // match is used to get all the TPI based on each WM ID
        { $match: { expense_book_id: singleExpenseBook._id } },

        {
          $group: {
            _id: "$expense_book_id",
            count: { $sum: 1 },
          },
        },
      ]);

      // to count total expenses based on date. each day how many expenses user did for each expense book;
      const totalExpensesCountByDate = await ExpenseList.aggregate([
        // match is used to get all the TPI based on each WM ID
        { $match: { expense_book_id: singleExpenseBook._id } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            TotalExpenses: { $sum: "$amount" },
          },
        },
        { $sort: { date: -1 } },
      ]);
      res.status(200).json({
        singleExpenseBook,
        expenseBookCategory,
        expenseList,
        totalExpenses,
        expenseListCountByDate,
        totalExpensesForEachExpenseBook,
        totalExpenseListPostCount,
        totalExpensesCountByDate,
      });
    } else {
      res.status(422).json({ error: "You cant access other user post" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// to test how lookup work
// Lookup can be used to get information from one collecto to another collection where we do joining.
// for example in expense book User schema is joined. so using lookup we can get user information from each expense book
// here from - means from which schema i want to get informationtion, sousers is the collection name of us user schema
// localField- is the field in the expenseBook where is connected
//foreign field is the id field of the user schema
// as - is a alias and we can give any name of it.

exports.getExpenseBookByLookup = async (req, res) => {
  try {
    const expensebookList = await ExpenseBook.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "Userfdgd",
        },
      },
    ]);

    res.status(200).json(expensebookList);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
