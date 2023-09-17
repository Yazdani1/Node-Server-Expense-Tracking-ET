const uuid = require('uuid');

const CourseEnrolment = require('../model/CourseEnrolment');
const Course = require('../model/Course');

/**
 * To create course enrolment
 * @param {*} req
 * @param {*} res
 */
exports.createCourseEnrolment = async (req, res) => {
  try {
    const { courseInstructorId, courseId, coupon } = req.body;

    const singleCourse = await Course.findOne({ _id: courseId }).populate('postedBy', 'name slug role _id');

    if (coupon !== singleCourse.coupon) {
      return res.status(422).json({ error: 'Wrong coupon code!' });
    }

    const alreadyExist = await CourseEnrolment.findOne({ courseId, enrolledBy: req.user });
    if (alreadyExist) {
      return res.status(422).json({ error: 'You already enroled to this course!' });
    }

    if (singleCourse.enrolledStudents >= singleCourse.maxStudents) {
      return res.status(422).json({ error: 'Course is already full!' });
    }

    const courseEnrolmentDetails = CourseEnrolment({
      courseInstructorId,
      courseId,
      coupon,
      slug: uuid.v4(),
      enrolledBy: req.user,
    });

    const saveCourseEnrolment = await CourseEnrolment.create(courseEnrolmentDetails);

    if (saveCourseEnrolment) {
      // When user enroled one course it updates the enroled student number
      const updateEnroledStudent = await Course.findByIdAndUpdate(
        singleCourse._id.toString(),
        {
          $inc: { enrolledStudents: 1 },
        },
        { new: true }
      );
      res.status(201).json(saveCourseEnrolment);
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get enroled course lists by subscriber.
 * To show a list of course that a particular subscriber has enroled
 */

exports.getAllEnroledCourseLists = async (req, res) => {
  try {
    const enrolledCourseLists = await CourseEnrolment.find({ enrolledBy: req.user._id })
      .populate('courseInstructorId', 'name slug role _id')
      .populate('courseId', 'title des coupon enrolledStudents maxStudents slug')
      .populate('enrolledBy', 'name slug role _id')
      .sort({ date: -1 });

    res.status(200).json(enrolledCourseLists);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
