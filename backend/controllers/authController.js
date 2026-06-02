const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//  REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, subjects, skillLevel, availability } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) 
      {
       return res.status(400).json({
       message: "Invalid email format"
       });
      }
  if (password.length < 6)
     {
       return res.status(400).json({
       message: "Password must be at least 6 characters"
         });
     }
    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      subjects,
      skillLevel,
      availability
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
    token,
    name: user.name,
    subjects: user.subjects,
    skillLevel: user.skillLevel,
    availability: user.availability
   });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};