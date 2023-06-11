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
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' })
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send({ card })
    })
    .catch(() => {
      if (res.status(400)) {
        res.status(400).send({ message: 'Карточка с указанным _id не найдена.' })
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send({ card })
    })
    .catch(() => {
      if (res.status(400)) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' })
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    res.send({ card })
  })
  .catch(() => {
    if (res.status(400)) {
      res.status(400).send({ message: 'Карточка с указанным _id не найдена.' })
    }
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  });
};