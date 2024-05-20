const express = require('express');
const { C_get_vendorLedger } = require('../controller/vendorLedger');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/C_get_vendorLedger/:id',adminAuth("Vendor Ledger Cash:View_Cash_vendor_Ledger"),C_get_vendorLedger);

module.exports = router;