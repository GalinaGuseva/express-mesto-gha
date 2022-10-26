const router = require('express').Router();
const { valGetUser, valUpdateUser, valNewAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getCurrentUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('users/me', getCurrentUser);
router.get('/users/:userId', valGetUser, getUserId);
router.patch('/users/me', valUpdateUser, updateUser);
router.patch('/users/me/avatar', valNewAvatar, updateAvatar);

module.exports = router;
