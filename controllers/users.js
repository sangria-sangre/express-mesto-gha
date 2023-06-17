const bcrypt = require('bcryptjs');
const userSchema = require('../models/user');
const jwt = require('jsonwebtoken');
const BadRequestError400 = require('../errors/BadRequestError400');
const ConflictError409 = require('../errors/ConflictError409');
const NotFoundError404 = require('../errors/NotFoundError404');

module.exports.getUsers = (req, res, next) => {
  userSchema.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  userSchema.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError404('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('Пользователь по указанному _id не найден.'));
      } else {
        return next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password} = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema
        .create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
        .then(() => res.status(201)
          .send(
            {
              data: {
                name,
                about,
                avatar,
                email,
              },
            },
          ))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError409('Пользователь с данным email уже был зарегестрирован.'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError400('Переданы некорректные данные при создании пользователя.'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError400('Переданы некорректные данные при создании пользователя.'));
      } else if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError404('Пользователь с указанным _id не найден.'));
      } else {
        return next(err);
      }
    }
    );
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError400('Переданы некорректные данные при создании пользователя.'));
      } else if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError404('Пользователь с указанным _id не найден.'));
      } else {
        return next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'L8Oe+Y9MvT7uAdcjRd6+rA', { expiresIn: '7d' }); //создание токена при успешной проверке данных
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError404('Пользователь не найден.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('Неправильные данные.'));
      } else {
        return next(err);
      }
    });
};
