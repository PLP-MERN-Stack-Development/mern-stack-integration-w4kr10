// postController.js - CRUD and extras for posts

const { body, param, query } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Post = require('../models/Post');

exports.listValidators = [
	query('page').optional().isInt({ min: 1 }),
	query('limit').optional().isInt({ min: 1, max: 100 }),
	query('category').optional().isMongoId(),
];

exports.list = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page || '1', 10);
	const limit = parseInt(req.query.limit || '10', 10);
	const skip = (page - 1) * limit;

	const filter = {};
	if (req.query.category) filter.category = req.query.category;

	const [total, posts] = await Promise.all([
		Post.countDocuments(filter),
		Post.find(filter)
			.populate('author', 'name')
			.populate('category', 'name')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
	]);

	res.json({ success: true, data: posts, pagination: { page, limit, total } });
});

exports.readValidators = [param('id').notEmpty()];

exports.read = asyncHandler(async (req, res) => {
	const identifier = req.params.id;
	const queryBy = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
	const post = await Post.findOne(queryBy)
		.populate('author', 'name')
		.populate('category', 'name');
	if (!post) return res.status(404).json({ success: false, error: 'Not found' });
	res.json({ success: true, data: post });
});

exports.createValidators = [
	body('title').notEmpty(),
	body('content').notEmpty(),
	body('category').isMongoId(),
];

exports.create = asyncHandler(async (req, res) => {
	const { title, content, category, tags, featuredImage, excerpt, isPublished } = req.body;
	const post = await Post.create({
		title,
		content,
		category,
		tags,
		featuredImage,
		excerpt,
		isPublished: !!isPublished,
		author: req.user._id,
	});
	res.status(201).json({ success: true, data: post });
});

exports.updateValidators = [
	param('id').isMongoId(),
	body('title').optional().notEmpty(),
	body('content').optional().notEmpty(),
	body('category').optional().isMongoId(),
];

exports.update = asyncHandler(async (req, res) => {
	const updates = req.body;
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ success: false, error: 'Not found' });
	if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
		return res.status(403).json({ success: false, error: 'Forbidden' });
	}
	Object.assign(post, updates);
	await post.save();
	res.json({ success: true, data: post });
});

exports.removeValidators = [param('id').isMongoId()];

exports.remove = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ success: false, error: 'Not found' });
	if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
		return res.status(403).json({ success: false, error: 'Forbidden' });
	}
	await post.deleteOne();
	res.json({ success: true, data: {} });
});

exports.addCommentValidators = [
	param('id').isMongoId(),
	body('content').notEmpty(),
];

exports.addComment = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ success: false, error: 'Not found' });
	await post.addComment(req.user._id, req.body.content);
	res.status(201).json({ success: true, data: post });
});

exports.searchValidators = [query('q').notEmpty()];

exports.search = asyncHandler(async (req, res) => {
	const q = req.query.q;
	const posts = await Post.find({
		$or: [
			{ title: { $regex: q, $options: 'i' } },
			{ content: { $regex: q, $options: 'i' } },
			{ excerpt: { $regex: q, $options: 'i' } },
		],
	})
		.populate('author', 'name')
		.populate('category', 'name')
		.sort({ createdAt: -1 })
		.limit(50);
	res.json({ success: true, data: posts });
});


