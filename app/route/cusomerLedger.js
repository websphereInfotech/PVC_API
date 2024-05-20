const express = require('express');
const {  C_get_customerLedger } = require('../controller/customerLedger');


const router = express.Router();

router.get('/C_get_customerLedger/:id',C_get_customerLedger);

module.exports = router;