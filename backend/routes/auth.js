const express = require('express');
const controller = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validation');
const settingsController = require('../controllers/settingsController');

const router = express.Router();
router.post('/signup', validateSignup, controller.signup);
router.post('/login', validateLogin, controller.login);
router.patch('/password', requireAuth, controller.changePassword);
router.patch('/privacy', requireAuth, settingsController.updatePrivacy);
router.post('/feedback', requireAuth, settingsController.submitFeedback);
router.delete('/account', requireAuth, settingsController.deleteAccount);
router.get('/me', requireAuth, controller.currentUser);
router.post('/logout', requireAuth, controller.logout);
module.exports = router;
