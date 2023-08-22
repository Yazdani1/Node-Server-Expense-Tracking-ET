const uuid = require('uuid');

const Job = require('../model/Job');

/**
 * To create a job posts and only employer can do it
 * @param {*} req
 * @param {*} res
 */
exports.createJobPosts = async (req, res) => {
  try {
    const { title, des, jobCity, jobSkills, visibility } = req.body;

    const jobDetails = Job({
      title,
      des,
      jobCity,
      jobSkills,
      visibility,
      slug: uuid.v4(),
      postedBy: req.user,
    });

    const saveJob = await Job.create(jobDetails);
    res.status(201).json(saveJob);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get loged in employer job posts
 * @param {*} req
 * @param {*} res
 */
exports.getEmployerJobPosts = async (req, res) => {
  try {
    const jobposts = await Job.find({ postedBy: req.user._id })
      .populate('postedBy', 'name role')
      .populate('approvedBy', 'name role')
      .sort({ date: -1 });
    res.status(200).json(jobposts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To update single job post and only employer can update their own job posts
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateSingleJobPost = async (req, res) => {
  try {
    const updateQuery = { _id: req.params.id };

    const singleJob = await Job.findById(updateQuery).populate('postedBy', 'name slug role _id');
    if (!singleJob) {
      return res.status(422).json({ error: 'Job post id could not found' });
    }

    // to check - employer can update their own job posts.
    // one employer can't update other employer job posts
    const logedInUser = req.user._id;
    if (logedInUser !== singleJob.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant update other employer job post' });
    }

    const { title, des, jobCity, jobSkills, visibility } = req.body;

    const payload = {
      title,
      des,
      jobCity,
      jobSkills,
      visibility,
    };

    const updateJob = await Job.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json(updateJob);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To delete job posts and employer can delete only their own job posts
 * @param {*} req
 * @param {*} res
 */
exports.deleteEmployerJobPost = async (req, res) => {
  try {
    const deleteQuery = { _id: req.params.id };

    const singleJob = await Job.findById(deleteQuery).populate('postedBy', 'name slug role _id');
    if (!singleJob) {
      return res.status(422).json({ error: 'Job post id could not found' });
    }

    // to check - employer can delete their own job posts.
    // one employer can't delete other employer job posts
    const logedInUser = req.user._id;
    if (logedInUser !== singleJob.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant delete other employer job post' });
    }

    const deleteSingleJobPost = await Job.findByIdAndDelete(deleteQuery);

    res.status(200).json({ message: 'Job post deleted successfully', deleteSingleJobPost });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To gel all the job posts and only admin can get all employer job posts
 * Only Admin can access it
 * @param {*} req
 * @param {*} res
 */

exports.getAllEmployerJobPosts = async (req, res) => {
  try {
    const allJobPosts = await Job.find().populate('postedBy', 'name role').populate('approvedBy', 'name role').sort({ date: -1 });

    res.status(200).json(allJobPosts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To update job posts and admin can update any employers any job posts
 * Only admin can access it
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateJobPosts = async (req, res) => {
  try {
    const updateQuery = { _id: req.params.id };

    const singleJob = await Job.findById(updateQuery).populate('postedBy', 'name slug role _id');
    if (!singleJob) {
      return res.status(422).json({ error: 'Job post id could not found' });
    }

    const { title, des, jobCity, jobSkills, visibility, status } = req.body;

    const payload = {
      title,
      des,
      jobCity,
      status,
      jobSkills,
      visibility,
      approvedBy: req.user,
      approvedDate: new Date(),
    };

    const updateJob = await Job.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json(updateJob);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get job posts for home page and only status approved and visibility public post will get
 * This to show all the job posts lists in the home page
 * @param {*} req
 * @param {*} res
 */
exports.getAllPostsList = async (req, res) => {
  try {
    const allJobs = await Job.find({ visibility: 'Public', status: 'Approved' })
      .populate('postedBy', 'name role')
      .populate('approvedBy', 'name role email')
      .sort({ date: -1 });

    res.status(200).json(allJobs);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
