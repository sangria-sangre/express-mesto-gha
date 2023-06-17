const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {createUser, login} = require('../controllers/users');
const { loginValidate, createUserValidate } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

router.post('/signin', loginValidate, login);
router.post('/signup', createUserValidate, createUser);
app.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(404).send({ message: '404: Not Found' });
});

module.exports = router;