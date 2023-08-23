const router = require('express').Router();

const { createJobWishList } = require('../controller/Course');

//Middleware
const { requireLogin } = require('../middleware/auth');

//Validation
const { validateJobWishList } = require('../validators/JobWishListValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create job wishlist and subscriber can add any jobs in their wihlist
 */

router.post('/create-job-wishlist', requireLogin, validateJobWishList, runValidation, createJobWishList);

module.exports = router;
