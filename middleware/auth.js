const jwt = require("jsonwebtoken");

const User = require("../model/user");

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
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //aatach tokemnn
      req.user = decode;
      next();
    } else {
      return res.status(400).json({ error: "Unauthorized Dont have access" });
    }
  } catch (err) {
    console.log(err);
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
    if (user.role != "Admin") {
      return res
        .status(500)
        .json({ error: "Unauthorized. Only Admin has access" });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
};
