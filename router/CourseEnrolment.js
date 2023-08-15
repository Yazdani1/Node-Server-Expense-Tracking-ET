const router = require('express').Router();

//Controller
const { createCourseEnrolment, getAllEnroledCourseLists } = require('../controller/CourseEnrolment');

//Middleware
const { requireLogin } = require('../middleware/auth');

//Validation
const { validateCourseEnrolment } = require('../validators/CourseEnrolmentValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create course enrollment
 */

router.post('/create-course-enrollment', requireLogin, validateCourseEnrolment, runValidation, createCourseEnrolment);

/**
 * To get enroled course list by subscriber.
 * To show a list course that a particular subscriber has enroled
 */

router.get('/get-enroled-course-lists', requireLogin, getAllEnroledCourseLists);

module.exports = router;
