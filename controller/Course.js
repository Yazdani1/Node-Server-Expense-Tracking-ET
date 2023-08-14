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
    const courseList = await Course.find({ postedBy: req.user._id }).populate('postedBy', 'name slug role').sort({ date: -1 });

    res.status(200).json(courseList);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
