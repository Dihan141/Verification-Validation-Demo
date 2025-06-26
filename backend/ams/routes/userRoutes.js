const express = require('express');
const { getUsers, addUser, getUserById } = require('../controller/userController');
const router = express.Router();

router.get('/', getUsers);
router.post('/add', addUser);
router.get('/:userId', getUserById);

module.exports = router;