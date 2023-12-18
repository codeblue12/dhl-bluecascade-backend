// controllers/userController.js
const asyncHandler= require('express-async-handler')
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token:token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json({error:"User Already Exists"})
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Generate and set token in the response
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


const getUserDetails = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const decodedUser = decodeToken(token.replace('Bearer ', ''));

  if (!decodedUser) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const mockUserDetails = {
    id: decodedUser.id,
    username: decodedUser.username,
    email: decodedUser.email,
    // Add other user details as needed
  };

  res.json({ user: mockUserDetails });
});
module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserDetails,
};