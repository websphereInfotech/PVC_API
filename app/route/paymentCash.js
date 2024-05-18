const express = require('express');
const { C_create_paymentCash, C_update_paymentCash, C_delete_paymentCash, C_view_paymentCash, C_get_all_paymentCash } = require('../controller/paymentCash');
const adminAuth = require('../middleware/adminAuth');
const {validation} = require('../constant/validate');

const router = express.Router();

router.post('/C_create_paymentCash',validation('create_paymentCash'),adminAuth('Payment Cash:create_payment_Cash'),C_create_paymentCash);
router.put('/C_update_paymentCash/:id',adminAuth('Payment Cash:update_payment_Cash'),C_update_paymentCash);
router.delete('/C_delete_paymentCash/:id',adminAuth('Payment Cash:delete_payment_Cash'),C_delete_paymentCash);
router.get('/C_view_paymentCash/:id',adminAuth('Payment Cash:view_payment_Cash'),C_view_paymentCash);
router.get('/C_get_all_paymentCash',adminAuth('Payment Cash:view_all_payment_Cash'),C_get_all_paymentCash);
module.exports = router;