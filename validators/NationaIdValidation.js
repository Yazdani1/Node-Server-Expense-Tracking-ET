const { check } = require('express-validator');

/**
 * To validate expense book input field
 */

exports.validateNationalId = [
  check('firstName').trim().not().isEmpty().withMessage('please add firstName!'),
  check('lastName').trim().not().isEmpty().withMessage('please add lastName!'),
  check('photo').trim().not().isEmpty().withMessage('please add photo!'),
  check('nationalIdNumber').trim().not().isEmpty().withMessage('please add nationalIdNumber!'),
  check('dateOfBirth').trim().not().isEmpty().withMessage('please add dateOfBirth!'),
  check('phoneNumber').trim().not().isEmpty().withMessage('please add phoneNumber!'),
  check('city').trim().not().isEmpty().withMessage('please add city!'),
  check('fatherName').trim().not().isEmpty().withMessage('please add fatherName!'),
  check('motherName').trim().not().isEmpty().withMessage('please add motherName!'),
  check('street').trim().not().isEmpty().withMessage('please add street!'),
  check('houseNumber').trim().not().isEmpty().withMessage('please add houseNumber!'),
  check('postalCode').trim().not().isEmpty().withMessage('please add postalCode!'),
];
