const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const AWS = require('aws-sdk');
const crypto = require('crypto');

// Use crypto functions here

const User = require('../model/user');
require('dotenv').config();

/**
 * AWS - config to send email and use aws services
 */
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_INFO,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_kEY_INFO,
  region: process.env.AWS_REGION_INFO,
  apiVersion: process.env.AWS_API_VERSION_INFO,
  correctClockSkew: true,
};
const SES = new AWS.SES(awsConfig);

/**
 * To do user registration
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userRegistration = async (req, res) => {
  try {
    const { name, email, password, role, city, countryName, continent, latitude, longitude } = req.body;

    const slug = slugify(name);
    const alreadyExist = await User.findOne({ name });
    if (alreadyExist) {
      return res.status(422).json({ error: 'User name already exist. try a different name' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: 'User already exist with same email address' });
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

    // To send email through aws ses when user loged in

    const params = {
      Source: process.env.EMAIL_FROM_INFO,
      Destination: {
        ToAddresses: [process.env.EMAIL_FROM_INFO],
      },
      ReplyToAddresses: [email],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <html>
                <h1 style={{color:"red"}}>Congratulations! You have created your account on Expense tracking web app</h1>
                <p>Visit your profile</p>
              </html>
              `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Hello: ' + name,
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();

    res.status(201).json({ createUserAccount, message: 'Account Created Successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Account could not create' });
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
      return res.status(400).json({ error: 'Account could not found ' });
    }
    const isMatchData = await bcrypt.compare(password, user.password);
    if (!isMatchData) {
      return res.status(400).json({ error: 'Wrong password' });
    }
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // To send email through aws ses when user loged in

    const params = {
      Source: process.env.EMAIL_FROM_INFO,
      Destination: {
        ToAddresses: [process.env.EMAIL_FROM_INFO],
      },
      ReplyToAddresses: [email],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <html>
                <h1 style={{color:"red"}}>You have signed in to your Expense tracking web app account!</h1>
                <p>Visit your profile</p>
              </html>
              `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Welcome Back: ' + email,
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();

    user.password = undefined;
    user.expireToken = undefined;
    user.resetToken = undefined;

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong, Could not Log In' });
  }
};

/**
 * Forgot password - by sending varification code to user email address
 * @param {*} req
 * @param {*} res
 */

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const singleUser = await User.findOne({ email });
    if (!singleUser) {
      return res.status(404).json({ error: 'User could not be found with your email!' });
    }

    // Generate a secure verification code
    const verificationCode = crypto.randomBytes(3).toString('hex'); // Generates a 6-character code

    // Calculate the expiration time (e.g., 15 minutes from now)
    // This will add a time for user verification code. so when send the code it also update the time
    // so that we can check the time and after that time if user try to use the code.
    // we can show error message and user wont be able to change their password

    const expirationTime = Date.now() + 2 * 60 * 1000; // 15 minutes in milliseconds

    // Store verification code and expiration time in the user's profile
    const payload = {
      passwordResetCode: verificationCode,
      passwordResetCodeExpiration: expirationTime,
    };

    // We need to update user profile with the verification code and code expiration time.
    // So that when user reset their password we can match the code and expiration time
    // Then user will be able to change thier password

    const updateUserProfile = await User.findByIdAndUpdate(
      singleUser._id.toString(),
      {
        $set: payload,
      },
      { new: true }
    );

    // Send email with the verification code

    const params = {
      Source: process.env.EMAIL_FROM_INFO,
      Destination: {
        ToAddresses: [process.env.EMAIL_FROM_INFO],
      },
      ReplyToAddresses: [email],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
          <html>
            <head>
              <style>
                /* Inline CSS for styling */
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                }
                h1{
                  color: white;
                }
                .container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 300px;
                  background-color: green;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                }
                .code {
                  background-color: #f2f2f2;
                  font-size: 20px;
                  padding: 20px;
                  border-radius: 5px;
                  justify-content: center;
                  align-items: center;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div>
                  <h1>Here is your password reset code. Use this code to reset your password:</h1>
                  <div class="code">Code:${verificationCode}</div>
                  <div class="code">Your E-mail is :${email}</div>

                  <p>Click the link below to reset your password:</p>
                  <a href="https://example.com/reset-password">Reset Password</a>
                </div>
              </div>
            </body>
          </html>
        `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Password Reset Code: ' + verificationCode,
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();

    console.log(singleUser._id);
    console.log(verificationCode);

    res.status(200).json(updateUserProfile);
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong, Could not Log In' });
  }
};

/**
 * Reset password if password reset code match
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassowrd } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User could not found' });
    }

    // to check the code that stored user profile when user sent forgot password email
    // if the code match then user will be able to set a new password
    if (verificationCode !== user.passwordResetCode) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    // Check if the code has expired - then user wont be able to add their new password
    const currentTime = Date.now();
    if (currentTime > user.passwordResetCodeExpiration) {
      return res.status(400).json({ error: 'Verification code has expired.' });
    }

    const hash_password = await bcrypt.hash(newPassowrd, 10);

    const payload = {
      passwordResetCode: null,
      passwordResetCodeExpiration: null,
      password: hash_password,
    };
    const updateUserPassword = await User.findByIdAndUpdate(
      user._id.toString(),
      {
        $set: payload,
      },
      { new: true }
    );

    console.log(user.passwordResetCode);
    console.log(user.passwordResetCodeExpiration);

    res.status(200).json(updateUserPassword);
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong, Could not Log In' });
  }
};

/**
 * To get all the user lists
 * @param {*} req
 * @param {*} res
 */
exports.getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const offset = (page - 1) * limit;
    const userlist = await User.find().sort({ date: -1 }).skip(offset).limit(limit).select('-password');
    res.status(200).json(userlist);
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong, Could not Log In' });
  }
};

// exports.getAllUser = async (req, res) => {
//   try {
//     const userlist = await User.find().sort({ date: -1 }).select("-password");
//     res.status(200).json(userlist);
//   } catch (error) {
//     res.status(500).json({ error: "Something Went Wrong, Could not Log In" });
//   }
// };

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
    res.status(500).json({ error: 'Something Went Wrong, Could not Log In' });
  }
};

/**
 * To get instructor access in the frontend side.
 * This will be used to have proteced route for the instructor area in the frontend side.
 */

exports.getInstructorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong, Could not Log In' });
  }
};

/**
 * To update user profile and only admin can do it
 * @param {*} req
 * @param {*} res
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, role, blockUser, accountType, award } = req.body;

    const slug = slugify(name);
    // const alreadyExist = await User.findOne({ name });
    // if (alreadyExist) {
    //   return res.status(422).json({ error: 'User name already exist. try a different name' });
    // }

    // To verify the award type

    const validAwardTypes = ['PullShark', 'QuickDraw', 'Yolo', 'GoldVolt'];
    // Check if any value in the award array is invalid
    const invalidAwards = award.filter((item) => !validAwardTypes.includes(item));

    if (invalidAwards.length > 0) {
      return res.status(400).json({ error: 'Invalid award types' });
    }

    // Check for duplicates
    const duplicates = award.filter((item, index) => award.indexOf(item) !== index);
    if (duplicates.length > 0) {
      return res.status(400).json({ error: 'Duplicate awards are not allowed' });
    }

    const updateQuery = { _id: req.params.id };

    const payload = {
      name,
      email,
      role,
      blockUser,
      accountType,
      award,
      slug,
    };

    const updateOneUserProfile = await User.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'User profile update successfully',
      updateOneUserProfile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To update a single user profile and to add profile picture - only loged in user can update their own profile details
 * @param {*} req
 * @param {*} res
 */
exports.updateSingleUserProfile = async (req, res) => {
  try {
    const { name, email, imageUrl, skills } = req.body;

    const updateQuery = { _id: req.params.id };
    const singleProfileDetails = await User.findById(updateQuery);

    if (!singleProfileDetails) {
      return res.status(422).json({ error: 'User does not exist' });
    }

    const loggedInUser = req.user._id;
    if (loggedInUser !== singleProfileDetails._id.toString()) {
      return res.status(422).json({ error: "You cannot update other users' profile details" });
    }

    const payload = {
      name,
      email,
      imageUrl,
      skills,
    };

    const user = await User.findByIdAndUpdate(
      updateQuery,
      {
        $set: payload,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Your profile has been updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * To get loged in user profile based on the token id- its for testing purpose and can be used for showing the
 * user profile details or maybe in the context api
 * @param {*} req
 * @param {*} res
 */
exports.getLogedInUserProfile = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user._id).select('-password');

    console.log(req.user?.name);

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
