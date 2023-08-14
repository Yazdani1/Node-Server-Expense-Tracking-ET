const { check } = require('express-validator');

/**
 * To validate courses input field
 */

exports.validateCourse = [
  check('title').trim().not().isEmpty().withMessage('please add title!'),
  check('des').trim().not().isEmpty().withMessage('please add description!'),
  check('coupon').trim().not().isEmpty().withMessage('please add coupon!'),
  check('maxStudents').trim().not().isEmpty().withMessage('please add maxStudents!'),
];
