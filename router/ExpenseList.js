const router = require("express").Router();
const {createExpenseList,deleteExpenseListItem,getTotalExpensesForEachUser} = require("../controller/ExpenseList");
const {requireLogin} = require("../middleware/auth");

// to create expense List for each expense book

router.post("/create-expense-list",requireLogin,createExpenseList);



// to delete a single expense list item

router.delete("/delete-expense-list/:id",requireLogin,deleteExpenseListItem);



// get all the expense list for each loged in  user


router.get("/total-expense",requireLogin,getTotalExpensesForEachUser);


module.exports = router;
