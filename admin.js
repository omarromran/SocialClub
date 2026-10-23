const express = require('express');
const controller = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get('/users', controller.listUsers);
router.patch('/users/:id/suspend', controller.setSuspended);
router.delete('/users/:id', controller.deleteUser);
router.post('/users/:id/sessions/revoke', controller.closeUserSessions);
router.post('/sessions/revoke-recent-password-changes', controller.closeRecentPasswordChangeSessions);

router.get('/posts', controller.listPosts);
router.delete('/posts/:id', controller.deletePost);
router.get('/comments', controller.listComments);
router.delete('/comments/:id', controller.deleteComment);
router.post('/system-post', controller.createSystemPost);

router.get('/features', controller.listFeatures);
router.patch('/features/:id', controller.updateFeature);
router.get('/trends', controller.getTrends);

module.exports = router;
