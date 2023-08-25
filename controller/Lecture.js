const uuid = require('uuid');

const Lecture = require('../model/Lecture');
const Course = require('../model/Course');
const CourseEnrolment = require('../model/CourseEnrolment');

/**
 * To create course lecture
 * @param {*} req
 * @param {*} res
 * @returns
 */

exports.createLectures = async (req, res) => {
  try {
    const { lectureTitle, lectureDes, courseId } = req.body;

    const userCourse = await Course.findOne({ _id: courseId }).populate('postedBy', 'name slug role _id');

    const logedInUser = req.user._id;
    if (logedInUser !== userCourse.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant post lectures for other instructor course' });
    }

    const alreadyExist = await Lecture.findOne({ lectureTitle, courseId, postedBy: req.user });
    if (alreadyExist) {
      return res.status(422).json({ error: 'You already used this title. try a new lecture title' });
    }

    // I need to count the total number of lecture and need to add that number in the position.
    // This position will be used to add drag and drop system
    const existingLecturesCount = await Lecture.countDocuments({ courseId, postedBy: req.user });
    const lectureDetails = Lecture({
      lectureTitle,
      lectureDes,
      courseId,
      slug: uuid.v4(),
      position: existingLecturesCount,
      postedBy: req.user,
    });

    const saveLecture = await Lecture.create(lectureDetails);
    res.status(201).json(saveLecture);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get a single course and list of lectures for a single course
 * To get list of enrolled students for a single course
 * @param {*} req
 * @param {*} res
 */

exports.getCourseLectures = async (req, res) => {
  try {
    const query = { slug: req.params.slug };
    const singleCourse = await Course.findOne(query).populate('postedBy', 'name slug role _id');

    if (!singleCourse) {
      return res.status(404).json({ error: 'Single course id could not found' });
    }

    const logedInUser = req.user._id;
    if (logedInUser !== singleCourse.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant view other instructor course details and lectures' });
    }

    const lectureLists = await Lecture.find({ courseId: singleCourse._id.toString() })
      .populate('courseId')
      .populate('postedBy', 'name slug role')
      .sort({ date: 1 });

    // here { enrolledBy: 1 } means i only want to get that field data and
    // i dont need to get rest of the field from CourseEnrolment schema

    const enroledStudents = await CourseEnrolment.find(
      { courseId: singleCourse._id.toString() },
      { enrolledBy: 1, coupon: 1, date: 1, courseId: 1 }
    ).populate('enrolledBy', 'name slug role email');

    res.status(200).json({ singleCourse, lectureLists, enroledStudents });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To update single lecture and instructor can update their own lecture
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateSingleLecture = async (req, res) => {
  try {
    const updateQuery = { _id: req.params.id };

    const singleLecture = await Lecture.findById(updateQuery).populate('postedBy', 'name slug role _id');
    if (!singleLecture) {
      return res.status(422).json({ error: 'Single lecture id could not found' });
    }

    const logedInUser = req.user._id;
    if (logedInUser !== singleLecture.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant update other instructor lectures' });
    }

    const { position, lectureTitle, lectureDes } = req.body;

    const payload = {
      lectureTitle,
      lectureDes,
      position,
    };

    const updateLecture = await Lecture.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json(updateLecture);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
