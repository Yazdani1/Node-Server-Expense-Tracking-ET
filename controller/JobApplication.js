const uuid = require('uuid');

const JobApplication = require('../model/JobApplication');
const Job = require('../model/Job');

/**
 * To create job application post and subscriber can apply for the job
 * @param {*} req
 * @param {*} res
 */
exports.createJobApplication = async (req, res) => {
  try {
    const { jobPostOwnerId, jobPostId } = req.body;

    const alreadyApplied = await JobApplication.findOne({ jobPostId, jobAppliedBy: req.user._id });

    if (alreadyApplied) {
      return res.status(422).json({ error: 'You already applied for this job' });
    }

    const jobApplicationDetails = JobApplication({
      jobPostOwnerId,
      jobPostId,
      slug: uuid.v4(),
      jobAppliedBy: req.user._id,
    });

    const saveJobApplication = await JobApplication.create(jobApplicationDetails);

    if (saveJobApplication) {
      const updateTotalApplicationNumber = await Job.findByIdAndUpdate(
        jobPostId,
        {
          $inc: { totalApplication: 1 },
        },
        { new: true }
      );
      res.status(201).json(saveJobApplication);
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get applied job application list - loged in user will see their own applied job list
 * @param {*} req
 * @param {*} res
 */
exports.getAllAppliedJobLists = async (req, res) => {
  try {
    const appliedJobLists = await JobApplication.find({ jobAppliedBy: req.user._id })
      .populate('jobPostOwnerId', { name: 1, slug: 1, role: 1 })
      .populate('jobPostId')
      .populate('jobAppliedBy', 'name email skills')
      .sort({ date: -1 });

    res.status(200).json(appliedJobLists);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To delete job application and user can only delete their applied job application
 * One user can't delete other users job application
 * @param {*} req
 * @param {*} res
 */
exports.deleteJobApplication = async (req, res) => {
  try {
    const deleteQuery = { _id: req.params.id };
    const singleJobApplication = await JobApplication.findOne(deleteQuery);

    if (!singleJobApplication) {
      return res.status(404).json({ error: 'Job application id could not found' });
    }

    const logedInUser = req.user._id;
    if (logedInUser !== singleJobApplication.jobAppliedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant delete other user applied job' });
    }

    const deleteSingleJobApplication = await JobApplication.findByIdAndDelete(deleteQuery);

    if (deleteSingleJobApplication) {
      const updateTotalApplicationNumber = await Job.findByIdAndUpdate(
        singleJobApplication.jobPostId.toString(),
        {
          $inc: { totalApplication: -1 },
        },
        { new: true }
      );
      res.status(201).json({ message: 'Job application deleted successfully', deleteSingleJobApplication });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
