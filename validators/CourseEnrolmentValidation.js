const { check } = require('express-validator');

/**
 * To validate courses input field
 */

exports.validateCourseEnrolment = [
  check('courseInstructorId').trim().not().isEmpty().withMessage('please add course instructor id!'),
  check('courseId').trim().not().isEmpty().withMessage('please add course id!'),
  check('coupon').trim().not().isEmpty().withMessage('please add coupon!'),
];
