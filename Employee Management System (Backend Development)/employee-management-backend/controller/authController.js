const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const jwt = require("jsonwebtoken");



async function register(req, res, next) {

    
    console.log("REQ BODY:", req.body);
  try {
      
    // 1️⃣ Validate incoming request
    const schema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      role: Joi.string().valid("SuperAdmin", "HRAdmin", "Manager", "Employee").required()
    });

    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { username, name, email, password, role } = req.body;

    // 2️⃣ Debug: check DB connection & request data
    console.log("✅ Register request received");
    console.log("Connected DB:", mongoose.connection.name);
    console.log("Incoming username:", username);
    console.log("Incoming email:", email);

    // 3️⃣ Check if email/username already exists
    const emailInUse = await User.exists({ email });
    console.log("Email exists in DB?", emailInUse);

    const usernameInUse = await User.exists({ username });
    console.log("Username exists in DB?", usernameInUse);

    if (emailInUse) return next({ status: 409, message: 'Email already registered' });
    if (usernameInUse) return next({ status: 409, message: 'Username not available' });

    // 4️⃣ Hash password & save user
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User({ username, name, email, password: hashedPassword, role });
    user = await user.save();

    // 5️⃣ Debug: check saved user
    console.log("New user created:", user);
    console.log("USER CREATED:", user);

    console.log("Cookies set:", res.getHeaders()['set-cookie']);

    // 9️⃣ Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user:user
    });
  } catch (err) {
    next(err);
  }
}


async function login(req, res, next) {
  try {
    // 1️⃣ Validate request body
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    // 2️⃣ Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    // 3️⃣ Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    // After verifying email/password...

     const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
   );

     res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
       user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
    }
      
    });

  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
}

const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}

module.exports = { register, login, logout };