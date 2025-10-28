// authController.js - Registration and login

const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const signToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
};

exports.registerValidators = [
	body('name').notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('Valid email is required'),
	body('password').isLength({ min: 6 }).withMessage('Password min length is 6'),
];

exports.register = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const existing = await User.findOne({ email });
	if (existing) {
		return res.status(400).json({ success: false, error: 'Email already in use' });
	}
	const user = await User.create({ name, email, password });
	const token = signToken(user);
	res.status(201).json({
		success: true,
		user: { id: user._id, name: user.name, email: user.email, role: user.role },
		token,
	});
});

exports.loginValidators = [
	body('email').isEmail().withMessage('Valid email is required'),
	body('password').notEmpty().withMessage('Password is required'),
];

exports.login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return res.status(400).json({ success: false, error: 'Invalid credentials' });
	}
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return res.status(400).json({ success: false, error: 'Invalid credentials' });
	}
	const token = signToken(user);
	res.json({
		success: true,
		user: { id: user._id, name: user.name, email: user.email, role: user.role },
		token,
	});
});


