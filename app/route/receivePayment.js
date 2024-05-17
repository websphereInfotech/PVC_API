const express = require('express');
const { C_create_receivePayment } = require('../controller/receivePayment');


const router = express.Router();

router.post('/C_create_receivePayment',C_create_receivePayment);

module.exports = router;