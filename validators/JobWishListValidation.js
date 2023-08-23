const { check } = require('express-validator');

/**
 * To validate job wish list required field
 */

exports.validateJobWishList = [
  check('jobPostPublishedBy').trim().not().isEmpty().withMessage('please add job post published id!'),
  check('jobPostId').trim().not().isEmpty().withMessage('please add job post id!'),
];
