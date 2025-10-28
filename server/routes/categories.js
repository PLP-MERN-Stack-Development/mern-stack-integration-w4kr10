// routes/categories.js - Category routes

const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const categoryCtrl = require('../controllers/categoryController');

router.get('/', categoryCtrl.list);
router.get('/:id', validate(categoryCtrl.readValidators), categoryCtrl.read);

router.post('/', protect, authorize('admin'), validate(categoryCtrl.createValidators), categoryCtrl.create);
router.put('/:id', protect, authorize('admin'), validate(categoryCtrl.updateValidators), categoryCtrl.update);
router.delete('/:id', protect, authorize('admin'), validate(categoryCtrl.removeValidators), categoryCtrl.remove);

module.exports = router;


