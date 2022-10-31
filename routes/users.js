const router = require('express').Router();
const { valId, valUpdateUser, valNewAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getCurrentUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:_id', valId, getUserId);
router.patch('/me', valUpdateUser, updateUser);
router.patch('/me/avatar', valNewAvatar, updateAvatar);

module.exports = router;
