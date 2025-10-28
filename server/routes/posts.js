// routes/posts.js - Post routes

const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const postCtrl = require('../controllers/postController');

router.get('/', validate(postCtrl.listValidators), postCtrl.list);
router.get('/search', validate(postCtrl.searchValidators), postCtrl.search);
router.get('/:id', validate(postCtrl.readValidators), postCtrl.read);

router.post('/', protect, validate(postCtrl.createValidators), postCtrl.create);
router.put('/:id', protect, validate(postCtrl.updateValidators), postCtrl.update);
router.delete('/:id', protect, validate(postCtrl.removeValidators), postCtrl.remove);

router.post('/:id/comments', protect, validate(postCtrl.addCommentValidators), postCtrl.addComment);

module.exports = router;


