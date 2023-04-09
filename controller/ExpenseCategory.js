const ExpenseCategory = require("../model/ExpenseCategory");

/**
 * To create expense category
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createExpenseCategory = async (req, res) => {
  try {
    const { category_name, expense_book_id } = req.body;

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
