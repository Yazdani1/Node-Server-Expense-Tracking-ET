const { check } = require('express-validator');

/**
 * To validate job application input field
 */

exports.validateJobApplicationPost = [
  check('jobPostOwnerId').trim().not().isEmpty().withMessage('please add job post owner Id!'),
  check('jobPostId').trim().not().isEmpty().withMessage('please add job post Id!'),
];
