const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('users/me', getCurrentUser);
router.get('/users/:userId', getUserId);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
