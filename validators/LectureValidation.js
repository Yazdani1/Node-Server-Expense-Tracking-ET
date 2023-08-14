const { check } = require('express-validator');

/**
 * To validate lecture input field
 */

exports.validateLecture = [
  check('lectureTitle').trim().not().isEmpty().withMessage('please add lecture title!'),
  check('lectureDes').trim().not().isEmpty().withMessage('please add lecture des!'),
  check('courseId').trim().not().isEmpty().withMessage('please add courseId!'),
];
