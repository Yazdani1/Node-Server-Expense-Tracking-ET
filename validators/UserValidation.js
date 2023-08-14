const { check } = require('express-validator');

/**
 * To validate user login input field
 */
exports.validateUserLogin = [
  check('email').normalizeEmail().isEmail().withMessage('please add your e-mails'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please add your password!')
    .isLength({ min: 6, max: 20 })
    .withMessage('password must be 6 to 20 characters long!'),
];

/**
 * To validate user registration input field
 */

exports.validateUserRegistration = [
  check('name').trim().not().isEmpty().withMessage('please write your name!'),
  check('email').normalizeEmail().isEmail().withMessage('please add a valid e-mail'),

  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please add your password!')
    .isLength({ min: 6, max: 20 })
    .withMessage('password must be 6 to 20 characters long!'),
];
