const uuid = require('uuid');

const JobWishList = require('../model/JobWishList');

/**
 * To create job wishlist and subscriber can add any jobs in their wihlist
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createJobWishList = async (req, res) => {
  try {
    const { jobPostPublishedBy, jobPostId } = req.body;

    const alreadyExist = await JobWishList.findOne({ jobPostId, postedBy: req.user._id });
    if (alreadyExist) {
      return res.status(422).json({ error: 'You already saved this job!' });
    }

    const jobWishlistDetails = JobWishList({
      jobPostPublishedBy,
      jobPostId,
      slug: uuid.v4(),
      postedBy: req.user,
    });

    const saveJobPost = await JobWishList.create(jobWishlistDetails);
    res.status(201).json(saveJobPost);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get all job wishlist for a single loged in user
 * Only subscriber can get they own job wish list
 * @param {*} req
 * @param {*} res
 */
exports.getJobWishList = async (req, res) => {
  try {
    const jobwishlist = await JobWishList.find({ postedBy: req.user._id })
      .populate('postedBy', 'name role')
      .populate('jobPostPublishedBy', 'name role email')
      .populate('jobPostId')
      .sort({ date: -1 });

    res.status(200).json(jobwishlist);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To delete job wishlist post and only subscriber can delete their own job wishlist
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteJobWishlist = async (req, res) => {
  try {
    const deleteQuery = { _id: req.params.id };

    const singleJob = await JobWishList.findById(deleteQuery).populate('postedBy', 'name slug role _id');
    if (!singleJob) {
      return res.status(422).json({ error: 'Job post id could not found' });
    }

    const logedInUser = req.user._id;
    if (logedInUser !== singleJob.postedBy._id.toString()) {
      return res.status(422).json({ error: 'You cant delete other people saved job post' });
    }

    const deleteSingleJobWishlistPost = await JobWishList.findByIdAndDelete(deleteQuery);

    res.status(200).json({ message: 'wishlist job deleted successfully', deleteSingleJobWishlistPost });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
