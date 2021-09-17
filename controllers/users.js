const User = require('../models/user');
const HttpError = require('../utils/HttpError');

const DEFAULT_ERROR = 500;
const VALIDATION_ERROR = 400;
const NOT_FOUND_ERROR = 404;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.find({ _id: req.params.userId })
    .orFail(new HttpError('idError', 'Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные _id пользователя' });
      } else if (err.name === 'idError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .orFail(new HttpError('idError', 'Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'idError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .orFail(new HttpError('idError', 'Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.name === 'idError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};
