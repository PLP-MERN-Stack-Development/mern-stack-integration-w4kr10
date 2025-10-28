// User.js - Mongoose model for users

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name'],
			trim: true,
			maxlength: [50, 'Name cannot be more than 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
	},
	{ timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


