const express = require('express');
const {  C_get_customerLedger } = require('../controller/customerLedger');
const adminToken = require('../middleware/adminAuth');


const router = express.Router();

router.get('/C_get_customerLedger/:id',adminToken('Customer Ledger Cash:View_Cash_customer_Ledger'),C_get_customerLedger);

module.exports = router;