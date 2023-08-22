const router = require('express').Router();

const {
  userRegistration,
  userLogin,
  getAllUser,
  getCurrentUserRole,
  updateUserProfile,
  updateSingleUserProfile,
  getLogedInUserProfile,
  getInstructorProfile,
  forgotPassword,
  resetPassword,
  getEmployerProfile,
} = require('../controller/user');

//Middleware
const { requireLogin, isAdmin, isInstructor, isEmployer } = require('../middleware/auth');

//Validation
const { validateUserLogin, validateUserRegistration, validateUserForgotPassword, validateUserRestPassword } = require('../validators/UserValidation');
const { runValidation } = require('../validators/Index');

/**
 * To do user registration
 */

router.post('/registration', validateUserRegistration, runValidation, userRegistration);

/**
 * To do user login
 */

router.post('/login', validateUserLogin, runValidation, userLogin);

/**
 * To get all the user lists and only adming can access it
 */
// router.get("/alluser", requireLogin, isAdmin, getAllUser);
router.get('/alluser', requireLogin, isAdmin, getAllUser);

/**
 * To get current user for the adming access in the frontend side. This will be used to have proteced route for the admin area.
 */

router.get('/current-user-role', requireLogin, isAdmin, getCurrentUserRole);

/**
 * To get instructor access in the frontend side.
 * This will be used to have proteced route for the instructor area in the frontend side.
 */

router.get('/instructor-profile', requireLogin, isInstructor, getInstructorProfile);

/**
 * To get employer access in the frontedn side.
 * This will be used to have proteced route for the employer area in the frontend side.
 * Only Employer can do it
 */

router.get('/employer-profile', requireLogin, isEmployer, getEmployerProfile);

/**
 * To update user profile and only admin can do it
 */

router.put('/update-user-profile/:id', requireLogin, isAdmin, updateUserProfile);

/**
 * To update single user profile
 */

router.put('/update-single-user-profile/:id', requireLogin, updateSingleUserProfile);

/**
 * To get loged in user profile based on the token id- its for testing purpose
 */
router.get('/user-profile', requireLogin, getLogedInUserProfile);

/**
 * Forgot password - by sending varification code to user email address
 */

router.post('/forgot-password', validateUserForgotPassword, runValidation, forgotPassword);

/**
 * Reset a new password - if verification code match then user will be able to add their new password
 */

router.post('/reset-password', validateUserRestPassword, runValidation, resetPassword);

module.exports = router;
