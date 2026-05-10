const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role, student } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Missing required fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // optionally create student record if provided
    let studentRef = null;
    if (role === 'Student' && student) {
      const created = await Student.create(student);
      studentRef = created._id;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({ student: studentRef, role, email, password_hash });

    const token = generateToken(user._id, user.role);
    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email }).populate('student');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({ user: { id: user._id, email: user.email, role: user.role, student: user.student }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getUsers= async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}