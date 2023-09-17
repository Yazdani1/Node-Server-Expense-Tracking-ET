const router = require("express").Router();

const {createIncomeRecord,getUserIncomeRecord,deleteIncomeRecord,getVideoStreamingData} = require("../controller/Income");
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


/**
 * To delete income record
 */


router.delete("/delete-single-income-record/:id",requireLogin,deleteIncomeRecord);


/**
 * For test purpose. I am trying to test how to get another api data using axios in this app using an api end point.
 */

router.get('/get-video-data',requireLogin,getVideoStreamingData);


module.exports = router;
