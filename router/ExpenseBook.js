const router = require("express").Router();
const {createExpenseBook,getExpenseBookList,getExpenseBookDetailsCategoryExpenseList,getExpenseBookByLookup} = require("../controller/ExpenseBook");
const {requireLogin} = require("../middleware/auth");

// to create expense book

router.post("/create-expensebook",requireLogin,createExpenseBook);

// to get expense book list for each loged in user
router.get("/get-expensebook-list",requireLogin,getExpenseBookList);


// to get expense book details, expense category and expense book item from one get request

router.get("/expense-book-details/:slug",requireLogin,getExpenseBookDetailsCategoryExpenseList);


// to test llokup aggreagation

router.get("/expensebook-by-lookupaggregation",getExpenseBookByLookup);

module.exports = router;
