const router = require('express').Router();

const { createJobWishList, getJobWishList, deleteJobWishlist, getSinlgeJobWishlist } = require('../controller/JobWishList');

//Middleware
const { requireLogin } = require('../middleware/auth');

//Validation
const { validateJobWishList } = require('../validators/JobWishListValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create job wishlist and subscriber can add any jobs in their wihlist
 */

router.post('/create-job-wishlist', requireLogin, validateJobWishList, runValidation, createJobWishList);

/**
 * To get all job wishlist for a single loged in user
 * Only subscriber can get they own job wish list
 */

router.get('/get-job-wishlist', requireLogin, getJobWishList);

/**
 * To delete job wishlist post and only subscriber can delete their own job wishlist
 */
router.delete('/delete-job-wishlist/:id', requireLogin, deleteJobWishlist);

/**
 * To get a single job wishlist for a single user for a single job post
 * This will be used to remove wishlist item - Its just to get the id of a job wishlist
 */

router.get('/get-single-job-wishlist/:slug', requireLogin, getSinlgeJobWishlist);

module.exports = router;
