const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

const User = require("../model/user");
require("dotenv").config();

/**
 * To do user registration
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      city,
      countryName,
      continent,
      latitude,
      longitude,
    } = req.body;

    const slug = slugify(name);
    const alreadyExist = await User.findOne({ name });
    if (alreadyExist) {
      return res
        .status(422)
        .json({ error: "User name already exist. try a different name" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: "User already exist with same email address" });
    }
    const hash_password = await bcrypt.hash(password, 10);

    userDetails = new User({
      name,
      email,
      slug,
      role,
      password: hash_password,
      city,
      countryName,
      continent,
      latitude,
      longitude,
    });

    const createUserAccount = await User.create(userDetails);
    res
      .status(201)
      .json({ createUserAccount, message: "Account Created Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Account could not create" });
  }
};

/**
 *
 * To do user login
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Account could not found " });
    }
    const isMatchData = await bcrypt.compare(password, user.password);
    if (!isMatchData) {
      return res.status(400).json({ error: "Wrong password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    user.password = undefined;
    user.expireToken = undefined;
    user.resetToken = undefined;

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong, Could not Log In" });
  }
};

/**
 * To get all the user lists
 * @param {*} req
 * @param {*} res
 */
exports.getAllUser = async (req, res) => {
  try {
    const userlist = await User.find().sort({ date: -1 });
    res.status(200).json(userlist);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong, Could not Log In" });
  }
};

/**
 * To get current user role for admin area in frontend side
 * @param {*} req
 * @param {*} res
 */
exports.getCurrentUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong, Could not Log In" });
  }
};

/**
 * To update user profile and only admin can do it
 * @param {*} req
 * @param {*} res
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, role, blockUser } = req.body;

    const updateQuery = { _id: req.params.id };

    const payload = {
      name,
      email,
      role,
      blockUser,
    };

    const updateOneUserProfile = await User.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json({
      message: "User profile update successfully",
      updateOneUserProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To update a single user profile and to add profile picture - only loged in user can update their own profile details
 * @param {*} req
 * @param {*} res
 */
exports.updateSingleUserProfile = async (req, res) => {
  try {
    const { name, email, imageUrl } = req.body;

    const updateQuery = { _id: req.params.id };
    const singleProfileDetails = await User.findById(updateQuery);

    if (!singleProfileDetails) {
      return res.status(422).json({ error: "User does not exist" });
    }

    const loggedInUser = req.user._id;
    if (loggedInUser !== singleProfileDetails._id.toString()) {
      return res
        .status(422)
        .json({ error: "You cannot update other users' profile details" });
    }

    const payload = {
      name,
      email,
      imageUrl,
    };

    const user = await User.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Your profile has been updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
