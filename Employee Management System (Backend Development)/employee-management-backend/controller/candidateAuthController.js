const Joi = require("joi");
const bcrypt = require("bcryptjs");
const Candidate = require("../models/candidateAuth");
const jwt = require("jsonwebtoken");

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const registerCandidate = async (req, res, next) => {
  try {
    const schema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, name, email, password } = req.body;
    const User = require("../models/User");

    const [candidateEmailInUse, candidateUsernameInUse, userEmailInUse, userUsernameInUse] = await Promise.all([
      Candidate.exists({ email }),
      Candidate.exists({ username }),
      User.exists({ email }),
      User.exists({ username }),
    ]);

    if (candidateEmailInUse || userEmailInUse) {
      return res.status(409).json({ message: "Email already registered" });
    }

    if (candidateUsernameInUse || userUsernameInUse) {
      return res.status(409).json({ message: "Username not available" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const candidate = await Candidate.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: candidate._id, role: "Candidate" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      success: true,
      message: "Candidate account created successfully",
      token,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        username: candidate.username,
        email: candidate.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email or username already registered" });
    }
    next(error);
  }
};

const loginCandidate = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const candidate = await Candidate.findOne({ email: req.body.email });
    if (!candidate) return res.status(401).json({ message: "Invalid email or password" });

    const passwordMatches = await bcrypt.compare(req.body.password, candidate.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: candidate._id, role: "Candidate" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      message: "Candidate login successful",
      token,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        username: candidate.username,
        email: candidate.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerCandidate, loginCandidate };