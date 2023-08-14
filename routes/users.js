const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateAvatar,
  updateUser,
} = require('../controllers/users');
const { updateUserValidation, userIdValidation, validationUpdateAvatar } = require('../middlewares/validation');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.post('/:userId', userIdValidation, getUserById);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRouter;
