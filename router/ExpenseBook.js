const router = require("express").Router();

const {
  createExpenseBook,
  getExpenseBookList,
  getExpenseBookDetailsCategoryExpenseList,
  getExpenseBookByLookup,
} = require("../controller/ExpenseBook");
const { requireLogin } = require("../middleware/auth");

//Validation
const {validateExpenseBook} = require("../validators/ExpenseBookValidation");
const {runValidation} = require("../validators/Index");


/**
 * To create expense book
 */

router.post("/create-expensebook",validateExpenseBook,runValidation, requireLogin, createExpenseBook);

/**
 * To get expense book list for each loged in user
 */

router.get("/get-expensebook-list", requireLogin, getExpenseBookList);

/**
 *  to get expense book details, expense category and expense book item from one get request
 */

router.get(
  "/expense-book-details/:slug",
  requireLogin,
  getExpenseBookDetailsCategoryExpenseList
);

/**
 * To test look up aggreagation
 */

router.get("/expensebook-by-lookupaggregation", getExpenseBookByLookup);

module.exports = router;
