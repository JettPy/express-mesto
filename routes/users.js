const router = require('express').Router();

/* eslint-disable object-curly-newline */
const { getUsers, getUserById, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
