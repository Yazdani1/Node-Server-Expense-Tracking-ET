const jwt = require('jsonwebtoken');

const User = require('../model/user');

/**
 * For token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.requireLogin = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      console.log(token);
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //aatach tokemnn
      req.user = decode;
      next();
    } else {
      return res.status(400).json({ error: 'Unauthorized Dont have access' });
    }
  } catch (err) {
    console.log(err);
    // return res.status(500).json({ error: err.message });
    return res.status(500).json({ error: 'Token has expired! try a new token' });
  }
};

/**
 * for admin to add role based authentication and access for api end-point
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role != 'Admin') {
      return res.status(500).json({ error: 'Unauthorized. Only Admin has access' });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: 'Something Went Wrong' });
  }
};

/**
 * For Instructor route api end point validation.
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role != 'Instructor') {
      return res.status(403).json({ error: 'Unauthorized. Only Instructor has access' });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong' });
  }
};

/**
 * For Employer route api end point validation.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.isEmployer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'Employer') {
      return res.status(403).json({ error: 'Unauthorized. Only Employer has access' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong' });
  }
};
