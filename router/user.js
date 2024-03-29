const router = require("express").Router();

const {
  userRegistration,
  userLogin,
  getAllUser,
  getCurrentUserRole,
  updateUserProfile,
  updateSingleUserProfile
} = require("../controller/user");

//Middleware
const { requireLogin, isAdmin } = require("../middleware/auth");

//Validation
const {
  validateUserLogin,
  validateUserRegistration,
} = require("../validators/UserValidation");

const { runValidation } = require("../validators/Index");

/**
 * To do user registration
 */

router.post(
  "/registration",
  validateUserRegistration,
  runValidation,
  userRegistration
);

/**
 * To do user login
 */

router.post("/login", validateUserLogin, runValidation, userLogin);

/**
 * To get all the user lists and only adming can access it
 */
router.get("/alluser", requireLogin, isAdmin, getAllUser);

/**
 * To get current user for the adming access in the frontend side. This will be used to have proteced route for the admin area.
 */

router.get("/current-user-role", requireLogin, isAdmin, getCurrentUserRole);

/**
 * To update user profile and only admin can do it
 */

router.put(
  "/update-user-profile/:id",
  requireLogin,
  isAdmin,
  updateUserProfile
);


/**
 * To update single user profile
 */

router.put("/update-single-user-profile/:id",requireLogin,updateSingleUserProfile);

module.exports = router;
