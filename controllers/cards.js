const cardSchema = require('../models/card');
const BadRequestError400 = require('../errors/BadRequestError400');
const ForbiddenError403 = require('../errors/ForbiddenError403');
const NotFoundError404 = require('../errors/NotFoundError404');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError400('Переданы некорректные данные при создании карточки.'));
      } else {
        return next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema.findById(cardId)
    .then((card) => {
      if(!card){
        throw new NotFoundError404('Карточка по указанному _id не найдена.');
      }

      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError403('Карточку невозможно удалить.'));
      }
      return card.deleteOne().then(() => res.send({ message: 'Карточка была удалена.' }));
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError404('Карточка по указанному _id не найдена.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('Карточка с указанным _id не найдена.'));
      } else {
        return next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
      if (err.message === 'NotValidId') {
        return next(new NotFoundError404('Передан несуществующий _id карточки.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('Переданы некорректные данные для постановки лайка.'));
      } else {
        return next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
      if (err.message === 'NotValidId') {
        return next(new NotFoundError404('Передан несуществующий _id карточки.'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError400('Переданы некорректные данные для снятия лайка.'));
      } else {
        return next(err);
      }
    });
};