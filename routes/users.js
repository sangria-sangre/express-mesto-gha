const userRoutes = require('express').Router();
const { getUsers, getUserById, updateUser, updateAvatarUser, getUser } = require('../controllers/users');
const { userIdValidate, meValidate, avatarValidate } = require('../middlewares/celebrate');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getUser);
userRoutes.get('/:userId', userIdValidate, getUserById);
userRoutes.patch('/me', meValidate, updateUser);
userRoutes.patch('/me/avatar', avatarValidate, updateAvatarUser);

module.exports = userRoutes;