const express = require('express');
const { findUserAndPay } = require('../controller/billerController');
const router = express.Router();

router.post('/', findUserAndPay);

module.exports = router;