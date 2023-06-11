const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' }) }
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link })
    .then((card) => res.send({ card }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' }) }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params.cardId;
  cardSchema.findByIdAndRemove(cardId)
    .then((card) => res.send({ card }))
    .catch(() => {
      if (res.status(404)) { res.status(404).send({ message: 'Карточка с указанным _id не найдена.' }) }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  cardSchema.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(404)) { res.status(404).send({ message: 'Передан несуществующий _id карточки.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }) }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  cardSchema.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch(() => {
      if (res.status(500)) { res.status(500).send({ message: 'Ошибка по умолчанию.' }) }
      if (res.status(404)) { res.status(404).send({ message: 'Передан несуществующий _id карточки.' }) }
      if (res.status(400)) { res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }) }
    });
};