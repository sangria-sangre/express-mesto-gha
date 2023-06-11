const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' })
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema.findByIdAndRemove(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send({ card })
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      } else if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточка с указанным _id не найдена.' })
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send({ card })
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' })
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send({ card })
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        return res.status(404).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Карточка с указанным _id не найдена.' })
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};