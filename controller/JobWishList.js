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

    const alreadyExist = await JobWishList.findOne({ jobPostId, postedBy: req.user });
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
