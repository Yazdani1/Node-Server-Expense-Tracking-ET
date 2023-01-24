const ExpenseCategory = require("../model/ExpenseCategory");
const ExpenseBook = require("../model/ExpenseBook");

// to create expense category

exports.createExpenseCategory = async (req, res) => {
  const { category_name, expense_book_id } = req.body;

  try {
    if (!category_name) {
      return res
        .status(422)
        .json({ error: "please add expense book category name" });
    }

    if (!expense_book_id) {
      return res
        .status(422)
        .json({ error: "please add expense book id" });
    }

    const alreadyExist = await ExpenseCategory.findOne({ category_name });
    if (alreadyExist) {
      return res
        .status(422)
        .json({ error: "Category name already exist. try a new name" });
    }

    const expenseCategoryDetails = ExpenseCategory({
      category_name,
      expense_book_id,
      postedBy: req.user,
    });
    const saveExpenseCategory = await ExpenseCategory.create(
      expenseCategoryDetails
    );
    res.status(201).json(saveExpenseCategory);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
