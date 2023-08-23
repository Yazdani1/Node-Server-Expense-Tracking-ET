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

module.exports = router;