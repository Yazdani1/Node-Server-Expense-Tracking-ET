const uuid = require('uuid');

const Lecture = require('../model/Lecture');
const Course = require('../model/Course');

/**
 * To create course lecture
 * @param {*} req
 * @param {*} res
 * @returns
 */

exports.createLectures = async (req, res) => {
  try {
    const { lectureTitle, lectureDes, courseId } = req.body;

    const alreadyExist = await Lecture.findOne({ lectureTitle, courseId, postedBy: req.user });
    if (alreadyExist) {
      return res.status(422).json({ error: 'You already used this title. try a new lecture title' });
    }

    const userCourse = await Course.findOne({ _id: courseId }).populate('postedBy', 'name slug role _id');

    const logedInUser = req.user._id;
    if (logedInUser !== userCourse.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant post lectures for other instructor course' });
    }

    const lectureDetails = Lecture({
      lectureTitle,
      lectureDes,
      courseId,
      slug: uuid.v4(),
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
 * @param {*} req
 * @param {*} res
 */

exports.getCourseLectures = async (req, res) => {
  try {
    const query = { slug: req.params.slug };
    const singleCourse = await Course.findOne(query).populate('postedBy', 'name slug role _id');

    if (!singleCourse) {
      return res.status(422).json({ error: 'Single course id could not found' });
    }

    const logedInUser = req.user._id;
    if (logedInUser !== singleCourse.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant view other instructor course details and lectures' });
    }

    const lectureLists = await Lecture.find({ courseId: singleCourse._id.toString() }).populate('postedBy', 'name slug role').sort({ date: 1 });

    res.status(200).json({ singleCourse, lectureLists });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
