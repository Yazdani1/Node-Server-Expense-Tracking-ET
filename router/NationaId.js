const router = require("express").Router();

const { createNationalId,getAllNationalIdList,searchNationalId } = require("../controller/NationaId");
const { requireLogin, isAdmin } = require("../middleware/auth");

//Validation
const { validateNationalId } = require("../validators/NationaIdValidation");
const { runValidation } = require("../validators/Index");

/**
 * To create National ID
 */

router.post(
  "/create-nationalId",
  requireLogin,
  isAdmin,
  validateNationalId,
  runValidation,
  createNationalId
);

/**
 * To get all the national id lists
 */

router.get("/get-all-nationaid-list", requireLogin, isAdmin,getAllNationalIdList);


/**
 * To search national id detila by national id number
 */

router.get("/search-nationalid",searchNationalId);


module.exports = router;
