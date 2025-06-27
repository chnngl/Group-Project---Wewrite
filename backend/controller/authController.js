const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Registers a new user
 *
 * If the email already exists, responds with status 400 and an appropriate message.
 * On successful registration, responds with status 201 and the user's ID, name, and email.
 * @param {Object} req - The request body containing user details - name, email, password
 */
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    // Check if email already exists
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Check if name already exists
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({
        message: "Username already exists, please choose another one",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //hashedPassword = password;

    // Save user info to DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// User Logout
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * Login a user
 *
 * Logs in a user by validating credentials and returns a JWT token on success
 * @param {Object} req - The request body containing login details - email, password
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login input:", email, password);
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Check if correct password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Update last login date
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Logged in successfully!",
      token,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res
      .status(400)
      .json({ success: false, msg: "Server error", error: error.message });
  }
};

/**
 * Changes the password of user account
 *
 * @param {Object} req - The request body contains the new user password
 */
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log("inside backend", req.body);
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findById(req.user);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Password updated successfully!",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

/**
 *  Gets user details given a user ID
 *
 * @param {string} req.params.userId - The ID of the user
 * @returns JSON response with the user details (not returning the password)
 */
exports.getUser = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user);
    user.password = "";
    console.log(user);
    res.status(200).json({
      success: true,
      msg: "User details fetched from DB!",
      user: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: "User not found",
      error: error.message,
    });
  }
};
