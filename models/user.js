const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const HttpError = require('../utils/HttpError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => validator.isURL(avatar),
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new HttpError(401, 'authError', 'Неверный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new HttpError(401, 'authError', 'Неверный логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
