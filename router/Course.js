const router = require('express').Router();

const { createCourse, getInstructorCourses } = require('../controller/Course');

//Middleware
const { requireLogin, isAdmin, isInstructor } = require('../middleware/auth');

//Validation
const { validateCourse } = require('../validators/CourseValidation');
const { runValidation } = require('../validators/Index');

/**
 * To do user registration
 */

router.post('/create-course', requireLogin, isInstructor, validateCourse, runValidation, createCourse);

/**
 * To get loged in instructor courses
 */
router.get('/get-instructor-courses', requireLogin, isInstructor, getInstructorCourses);

module.exports = router;
