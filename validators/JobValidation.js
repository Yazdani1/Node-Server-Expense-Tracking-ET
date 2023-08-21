const { check } = require('express-validator');

/**
 * To validate job post input field
 */

exports.validateJobPost = [
  check('title').trim().not().isEmpty().withMessage('please add job title!'),
  check('des').trim().not().isEmpty().withMessage('please add job description!'),
  check('jobCity').trim().not().isEmpty().withMessage('please add job city!'),
  check('visibility').trim().not().isEmpty().withMessage('please add job visibility!'),
  check('jobSkills')
    .isArray()
    .withMessage('Job skills should be an array!')
    .notEmpty()
    .withMessage('Please add at least one job skill!')
    .custom((value, { req }) => {
      if (!value.every((skill) => typeof skill === 'string' && skill.trim() !== '')) {
        throw new Error('Job skills should be non-empty strings');
      }
      return true;
    }),
];
