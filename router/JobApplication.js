const router = require('express').Router();

//Controller

const { createJobApplication, getAllAppliedJobLists, deleteJobApplication } = require('../controller/JobApplication');

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

module.exports = router;
