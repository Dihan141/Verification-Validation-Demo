const express = require('express');
const { addUser, getBalance, setBalance } = require('../controller/userController');
const router = express.Router();

router.post('/', addUser);
router.get('/balance/:userId', getBalance)
router.post('/balance/:userId', setBalance)

module.exports = router;