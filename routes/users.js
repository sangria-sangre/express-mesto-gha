const userRoutes = require('express').Router();
const { getUsers, getUserById, createUser, updateUser, updateAvatarUser } = require('../controllers/users');

userRoutes.get('/users', getUsers);
userRoutes.get('/users/:userId', getUserById);
userRoutes.post('/users', createUser);
userRoutes.patch('/users/me', updateUser);
userRoutes.patch('/users/me/avatar', updateAvatarUser);

module.exports = userRoutes;