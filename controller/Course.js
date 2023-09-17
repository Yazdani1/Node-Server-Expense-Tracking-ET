const uuid = require('uuid');

const Course = require('../model/Course');

/**
 * To create course
 * @param {*} req
 * @param {*} res
 * @returns
 */

exports.createCourse = async (req, res) => {
  try {
    const { title, des, coupon, maxStudents } = req.body;

    const alreadyExist = await Course.findOne({ coupon, postedBy: req.user });
    if (alreadyExist) {
      return res.status(422).json({ error: 'You already used this coupon. try a new coupon' });
    }

    const courseDetails = Course({
      title,
      des,
      coupon,
      maxStudents,
      slug: uuid.v4(),
      postedBy: req.user,
    });

    const saveCourse = await Course.create(courseDetails);
    res.status(201).json(saveCourse);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get logedin instructor courses
 * @param {*} req
 * @param {*} res
 */
exports.getInstructorCourses = async (req, res) => {
  try {
    const courseList = await Course.find({ postedBy: req.user._id }).populate('postedBy', 'name slug role imageUrl').sort({ date: -1 });

    res.status(200).json(courseList);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To filter loged in instructor courses in ascending and decinding
 * @param {*} req
 * @param {*} res
 */
exports.searchInstructorCourse = async (req, res) => {
  try {
    const courseList = await Course.find({ postedBy: req.user._id })
      .populate('postedBy', 'name slug role imageUrl')
      .collation({ locale: 'en', strength: 2 }) // This one search title even title has lowercase and uppercase
      .sort({ title: req.query.sortbytitle });

    res.status(200).json(courseList);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get all the course lists for subscriber view
 * @param {*} req
 * @param {*} res
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courseList = await Course.find().populate('postedBy', 'name slug role imageUrl').sort({ date: -1 });
    res.status(200).json(courseList);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get a single course details for subscriber enrollment
 */
exports.getSingleCourseDetails = async (req, res) => {
  try {
    const courseQuery = { slug: req.params.slug };

    const singleCourse = await Course.findOne(courseQuery).populate('postedBy', 'name slug role imageUrl');
    res.status(200).json(singleCourse);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
