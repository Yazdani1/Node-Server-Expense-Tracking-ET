const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const User = require("../model/user");
require("dotenv").config();

// to register
exports.userRegistration = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Please Add Your Full Name" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ error: "Please Add Your valid E-mail Address" });
    }
    if (!password) {
      return res.status(400).json({ error: "Please Add Your Password" });
    }
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
        .status(400)
        .json({ error: "User already exist with same email address" });
    }
    const hash_password = await bcrypt.hash(password, 10);

    userDetails = new User({
      name,
      email,
      slug,
      role,
      password: hash_password,
    });

    const createUserAccount = await User.create(userDetails);
    res
      .status(201)
      .json({ createUserAccount, message: "Account Created Successfully" });
  } catch (error) {
    res.status(400).json({ error: "Account could not create" });
  }
};
// to log in
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "add your register email" });
    }
    if (!password) {
      return res.status(400).json({ error: "add your password" });
    }
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
    res.status(400).json({ error: "Something Went Wrong, Could not Log In" });
  }
};

// to get all the user list

exports.getAllUser = async (req, res) => {
  try {
    const userlist = await User.find().sort({ date: -1 });
    res.status(200).json(userlist);
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong, Could not Log In" });
  }
};

// to get current user role for admin area in frontend side

exports.getCurrentUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong, Could not Log In" });
  }
};
