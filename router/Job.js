const router = require('express').Router();

//Controller

const {
  createJobPosts,
  getEmployerJobPosts,
  updateSingleJobPost,
  deleteEmployerJobPost,
  getAllEmployerJobPosts,
  updateJobPosts,
  getAllPostsList,
  getJobMatch,
  getJobDetails,
} = require('../controller/Job');

//Middleware
const { requireLogin, isAdmin, isEmployer } = require('../middleware/auth');

//Validation
const { validateJobPost } = require('../validators/JobValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create job posts and only Employer can create job post
 */

router.post('/create-jobpost', requireLogin, isEmployer, validateJobPost, runValidation, createJobPosts);

/**
 * To get loged in employer job posts
 */

router.get('/get-employer-jobpost', requireLogin, isEmployer, getEmployerJobPosts);

/**
 * To update single job post and only employer can update their own job posts
 */

router.put('/update-employer-single-job/:id', requireLogin, isEmployer, updateSingleJobPost);

/**
 * To delete job posts and employer can delete only their own job posts
 */

router.delete('/delete-single-jobpost/:id', requireLogin, isEmployer, deleteEmployerJobPost);

/**
 * To gel all the job posts and only admin can get all employer job posts
 * Only admin can accessit
 */

router.get('/get-allemployer-jobposts', requireLogin, isAdmin, getAllEmployerJobPosts);

/**
 * To update job posts and admin can update any employers any job posts
 * Only admin can accessit
 */

router.put('/update-job-posts/:id', requireLogin, isAdmin, updateJobPosts);

/**
 * To get job posts for home page and only status approved and visibility public post will get
 */

router.get('/all-job-posts', getAllPostsList);

/**
 * To match job and suggest job for subscriber user based on their skills that you added to their profile
 * It will auto suggest job that match their skill sin thei profile
 */

router.get('/get-job-match', requireLogin, getJobMatch);

/**
 * To get job details and other job for the same user.
 * Its for public view
 */

router.get('/get-job-details/:slug', getJobDetails);

/**
 * To update employer job posts, Public or Privaate, it can change all the job posts visibility status all together
 * If user want to make public or private to all of their job posts then they can do all these in just one click.
 * it first get all employer job posts then update all the job posts visibility based on employer input
 */

module.exports = router;
