const router = require('express').Router();

const { createCourse, getInstructorCourses, getAllCourses, getSingleCourseDetails, searchInstructorCourse } = require('../controller/Course');

//Middleware
const { requireLogin, isAdmin, isInstructor } = require('../middleware/auth');

//Validation
const { validateCourse } = require('../validators/CourseValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create course
 */

router.post('/create-course', requireLogin, isInstructor, validateCourse, runValidation, createCourse);

/**
 * To get loged in instructor courses
 */
router.get('/get-instructor-courses', requireLogin, isInstructor, getInstructorCourses);

/**
 * To search loged in instructor courses in ascending and decinding 
 */

router.get("/search-instrcutor-course",requireLogin,isInstructor,searchInstructorCourse);

/**
 * To get all the course lists for subscribers so that subscriber can enroll to a course
 */

router.get('/get-all-courses', requireLogin, getAllCourses);

/**
 * To get a single course details for subscriber enrollment
 */

router.get('/get-single-course-details/:slug', requireLogin, getSingleCourseDetails);

module.exports = router;
