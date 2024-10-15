const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
  const {
    username, email, password, role, mobileNumber, registrationNumber, semester,
    branch, section, rollNumber, batch, session, academicYear, electives // Added electives field
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username, email, password, role, mobileNumber, registrationNumber, semester,
      branch, section, rollNumber, batch, session, academicYear, electives // Added electives field
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

















// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (user.isApproved !== true) {
      console.log('User not approved');
      return res.status(403).json({ msg: 'User not approved' });
    }

    // Check if the password is hashed
    const passwordIsHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

    let isMatch = false;

    if (passwordIsHashed) {
      // Compare hashed passwords
      isMatch = await bcryptjs.compare(password, user.password);
    } else {
      // If plaintext password is detected, force user to update it
      isMatch = password === user.password;
      if (isMatch) {
        // Hash the plaintext password and update the user record
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log('Plaintext password hashed and updated in the database.');
      }
    }

    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token and user information as response
    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Server error');
  }
};
