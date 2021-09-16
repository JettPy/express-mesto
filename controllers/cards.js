const Card = require('../models/card');
const HttpError = require('../utils/HttpError');

const DEFAULT_ERROR = 500;
const VALIDATION_ERROR = 400;
const NOT_FOUND_ERROR = 404;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new HttpError('idError', 'Карточка с указанным _id не найдена'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'idError' || err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new HttpError('idError', 'Карточка с указанным _id не найдена'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.name === 'idError' || err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new HttpError('idError', 'Карточка с указанным _id не найдена'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.name === 'idError' || err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};
