const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_salesInvoice, create_salesInvoiceItem, update_salesInvoiceItem, update_salesInvoice, delete_salesInvoiceItem, delete_salesInvoice, view_salesInvoice, get_all_salesInvoice } = require('../controller/admincontroller');

const router = express.Router();


router.post('/create_salesinvoice', adminAuth, validation('create_salesinvoice'), create_salesInvoice);
router.post('/create_salesinvoice_item', adminAuth,validation('create_salesinvoiceitem') ,create_salesInvoiceItem);
router.put('/update_salesInvoice/:id', adminAuth, update_salesInvoice);
router.put('/update_salesInvoiceItem/:id', adminAuth, update_salesInvoiceItem);
router.delete('/delete_salesInvoice/:id', adminAuth, delete_salesInvoice);
router.delete('/delete_salesInvoiceItem/:id', adminAuth, delete_salesInvoiceItem);
router.get('/view_salesInvoice/:id', adminAuth, view_salesInvoice);
router.get('/get_all_salesInvoice', adminAuth, get_all_salesInvoice);


module.exports = router;