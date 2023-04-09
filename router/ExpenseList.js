const router = require("express").Router();
const {
  createExpenseList,
  deleteExpenseListItem,
  getTotalExpensesForEachUser,
} = require("../controller/ExpenseList");
const { requireLogin } = require("../middleware/auth");


//Validation
const {validateExpenseList} = require("../validators/ExpenseListValidation");
const {runValidation} = require("../validators/Index");




/**
 * To create expense list for each expense book item.
 */

router.post("/create-expense-list",validateExpenseList,runValidation, requireLogin, createExpenseList);

/**
 * To delete a single expense list item
 */

router.delete("/delete-expense-list/:id", requireLogin, deleteExpenseListItem);

/**
 * To get all the expense list for each loged in  user
 */

router.get("/total-expense", requireLogin, getTotalExpensesForEachUser);

module.exports = router;
