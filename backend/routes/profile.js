const express = require('express');
const multer = require('multer');
const controller = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.get('/', requireAuth, controller.getProfile);
router.get('/followers', requireAuth, controller.getFollowers);
router.get('/following', requireAuth, controller.getFollowing);
router.patch('/bio', requireAuth, controller.updateBio);
router.patch('/', requireAuth, upload.single('profilePicture'), controller.updateProfile);
router.delete('/picture', requireAuth, controller.removeProfilePicture);
module.exports = router;
