// routes/auth.js - Auth routes

const express = require('express');
const router = express.Router();

const { validate } = require('../middleware/validate');
const authCtrl = require('../controllers/authController');

router.post('/register', validate(authCtrl.registerValidators), authCtrl.register);
router.post('/login', validate(authCtrl.loginValidators), authCtrl.login);

module.exports = router;


