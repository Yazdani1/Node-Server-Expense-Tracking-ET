const { check } = require("express-validator");

/**
 * To validate expense book input field
 */

exports.validateIncomeRecord = [

  check("title").trim().not().isEmpty().withMessage("please add income title!"),
  check("des").trim().not().isEmpty().withMessage("please add income description!"),
  check("amount").trim().not().isEmpty().withMessage("please add income amount!"),


];
