const userSchema = require('../models/user');

module.exports.getUsers = (req, res) => {
  userSchema.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  userSchema.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' })
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' })
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate( req.user._id, { name, about }, { new: true,  runValidators: true})
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      } if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' })
      } if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true,  runValidators: true})
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      } if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' })
      } if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
    });
};