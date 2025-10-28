// categoryController.js - CRUD for categories

const { body, param, query } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/Category');

exports.list = asyncHandler(async (req, res) => {
	const categories = await Category.find().sort('name');
	res.json({ success: true, data: categories });
});

exports.createValidators = [
	body('name').notEmpty().withMessage('Name is required'),
];

exports.create = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const exists = await Category.findOne({ name });
	if (exists) {
		return res.status(400).json({ success: false, error: 'Category exists' });
	}
	const category = await Category.create({ name, description });
	res.status(201).json({ success: true, data: category });
});

exports.readValidators = [param('id').isMongoId().withMessage('Invalid id')];

exports.read = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);
	if (!category) return res.status(404).json({ success: false, error: 'Not found' });
	res.json({ success: true, data: category });
});

exports.updateValidators = [
	param('id').isMongoId().withMessage('Invalid id'),
	body('name').optional().notEmpty(),
];

exports.update = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const category = await Category.findByIdAndUpdate(
		req.params.id,
		{ name, description },
		{ new: true, runValidators: true }
	);
	if (!category) return res.status(404).json({ success: false, error: 'Not found' });
	res.json({ success: true, data: category });
});

exports.removeValidators = [param('id').isMongoId().withMessage('Invalid id')];

exports.remove = asyncHandler(async (req, res) => {
	const category = await Category.findByIdAndDelete(req.params.id);
	if (!category) return res.status(404).json({ success: false, error: 'Not found' });
	res.json({ success: true, data: {} });
});


