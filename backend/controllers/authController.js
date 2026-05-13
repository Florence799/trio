const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password, role, registeredNumber, department, year, section, mobile } = req.body;
    
    // Trim inputs
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedRegNo = registeredNumber?.trim();

    // Check if email already exists
    const existingEmail = await User.findOne({ email: trimmedEmail });
    if (existingEmail) {
      return res.status(400).send({ error: 'Email address is already registered.' });
    }
    
    // Check if registered number already exists (for both students and faculty)
    if (trimmedRegNo) {
      const existingRegNo = await User.findOne({ 
        registeredNumber: { $regex: new RegExp(`^${trimmedRegNo}$`, 'i') } 
      });
      if (existingRegNo) {
        const errorMsg = role === 'Student' ? 'Registered Number already exists.' : 'Faculty ID already exists.';
        return res.status(400).send({ error: errorMsg });
      }
    }

    const user = new User({ 
      name: name?.trim(), 
      email: trimmedEmail, 
      password, 
      role, 
      registeredNumber: trimmedRegNo, 
      department, 
      year, 
      section, 
      mobile: mobile?.trim() 
    });
    
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { registeredNumber, email, password } = req.body;
    
    let query = {};
    if (registeredNumber) {
      query = { registeredNumber: { $regex: new RegExp(`^${registeredNumber.trim()}$`, 'i') } };
    } else if (email) {
      query = { email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } };
    } else {
      return res.status(400).send({ error: 'Please provide Registered Number or Email.' });
    }

    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(401).send({ error: 'Account not found. Please check your credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Incorrect password. Please try again.' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'Student' });
    const teachers = await User.countDocuments({ role: 'Teacher' });
    res.send({ totalUsers, students, teachers });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login, getUserStats };
