const express = require('express');
const controller = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validation');

const router = express.Router();
router.post('/signup', validateSignup, controller.signup);
router.post('/login', validateLogin, controller.login);
router.patch('/password', requireAuth, controller.changePassword);
router.get('/me', requireAuth, controller.currentUser);
router.post('/logout', requireAuth, controller.logout);
module.exports = router;
