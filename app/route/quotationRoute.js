const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_quotation, create_quotationItem, update_quotation, update_quotationItem, delete_quotation, delete_quotationitem, view_quotation, get_all_quotation } = require('../controller/admincontroller');
const router = express.Router();


router.post('/create_quotation', adminAuth, validation('create_quotation'), create_quotation);
router.post('/create_quatationItem', adminAuth, validation('create_quotationitem'), create_quotationItem);
router.put('/update_quotation/:id', adminAuth, update_quotation);
router.put('/update_quotationItem/:id', adminAuth, update_quotationItem);
router.delete('/delete_quotation/:id', adminAuth, delete_quotation);
router.delete('/delete_quotationitem/:id', adminAuth, delete_quotationitem);
router.get('/view_quotation/:id', adminAuth, view_quotation);
router.get('/get_all_quotation', adminAuth, get_all_quotation);


module.exports = router;