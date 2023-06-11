const userSchema = require('../models/user');

module.exports.getUsers = (req, res) => {
  userSchema.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }) }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = request.user._id;
  userSchema.findById(userId)
    .then((user) => {
      if (!user) {
        res.send({ message: 'Пользователь не найден' });
      }
      res.send({ user });
    })
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(404)) { res.status(404).send({ message: ' Пользователь по указанному _id не найден.' }) }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' })
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = request.body;
  const { userId } = request.user._id;
  userSchema.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send({ user }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(404)) { res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' }) }
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = request.body;
  const { userId } = request.user._id;
  userSchema.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send({ user }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(404)) { res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' }) }
    });
};