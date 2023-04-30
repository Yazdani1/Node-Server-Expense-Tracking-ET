const router = require("express").Router();

const {createExpenseCategory} = require("../controller/ExpenseCategory");
const {requireLogin,isAdmin} = require("../middleware/auth");

//Validation
const {validateExpenseCategory} = require("../validators/ExpenseCategoryValidation");
const {runValidation} = require("../validators/Index");

/**
 * To create expense category.
 */

router.post("/create-expense-category",validateExpenseCategory,runValidation,requireLogin,createExpenseCategory);



module.exports = router;
