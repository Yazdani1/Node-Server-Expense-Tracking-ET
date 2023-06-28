const router = require("express").Router();

const {createIncomeRecord,getUserIncomeRecord} = require("../controller/Income");
const { requireLogin,isAdmin } = require("../middleware/auth");

//Validation
const { validateIncomeRecord } = require("../validators/IncomeValidation");
const { runValidation } = require("../validators/Index");

/**
 * To create income record
 */

router.post("/create-income-record",requireLogin,validateIncomeRecord,runValidation, createIncomeRecord);


/**
 * To get loged in user income record
 */

router.get("/get-income-record",requireLogin,getUserIncomeRecord);




module.exports = router;
