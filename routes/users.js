const userRoutes = require('express').Router();
const { getUsers, getUserById, createUser, updateUser, updateAvatarUser } = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatarUser);

module.exports = userRoutes;