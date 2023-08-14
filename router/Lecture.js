const router = require('express').Router();

const { createLectures, getCourseLectures } = require('../controller/Lecture');

//Middleware
const { requireLogin, isAdmin, isInstructor } = require('../middleware/auth');

//Validation
const { validateLecture } = require('../validators/LectureValidation');
const { runValidation } = require('../validators/Index');

/**
 * To create course lectures
 */

router.post('/create-lectures', requireLogin, isInstructor, validateLecture, runValidation, createLectures);

/**
 * To get a single course and list of lectures for a single course
 */

router.get('/get-course-lectures/:slug', requireLogin, isInstructor, getCourseLectures);

module.exports = router;
