const router = require('express').Router();
const { valId, valUpdateUser, valNewAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getCurrentUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('users/me', getCurrentUser);
router.patch('/users/me', valUpdateUser, updateUser);
router.patch('/users/me/avatar', valNewAvatar, updateAvatar);
router.get('/users/:_id', valId, getUserId);

module.exports = router;
