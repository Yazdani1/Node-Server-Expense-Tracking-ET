const router = require('express').Router();

//Controller

const { createJobApplication, getAllAppliedJobLists, deleteJobApplication, getJobDetailsApplicationList } = require('../controller/JobApplication');

//Middleware
const { requireLogin, isAdmin, isEmployer } = require('../middleware/auth');

//Validation
const { validateJobApplicationPost } = require('../validators/JobApplicationValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create job application post and subscriber can apply for the job
 */

router.post('/create-job-application', requireLogin, validateJobApplicationPost, runValidation, createJobApplication);

/**
 * To get applied job application list - loged in user will see their own applied job list
 */

router.get('/get-applied-job-lists', requireLogin, getAllAppliedJobLists);

/**
 * To delete job application and user can only delete their applied job application
 */

router.delete('/delete-job-application/:id', requireLogin, deleteJobApplication);

/**
 * To get all the job application list for a single job posts
 * Only employer will have option see their own job applicant list
 * This will first get a single job post details and then based on single job post,
 * it will get all the job application list
 */

router.get('/job-details-applicationlist/:slug', requireLogin, isEmployer, getJobDetailsApplicationList);

module.exports = router;
