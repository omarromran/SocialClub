const express = require('express');
const controller = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', requireAuth, controller.getConversations);
router.get('/unread-count', requireAuth, controller.getUnreadCount);
router.get('/users/search', requireAuth, controller.searchUsers);
router.get('/user/by-username/:username', requireAuth, controller.getUserByUsername);
router.get('/:userId', requireAuth, controller.getMessages);
router.post('/', requireAuth, controller.sendMessage);

module.exports = router;
