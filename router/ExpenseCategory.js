const router = require("express").Router();
const {createExpenseCategory} = require("../controller/ExpenseCategory");
const {requireLogin,isAdmin} = require("../middleware/auth");

router.post("/create-expense-category",requireLogin,createExpenseCategory);



module.exports = router;
