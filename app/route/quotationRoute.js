const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_quotation, create_quotationItem, update_quotation, update_quotationItem, delete_quotation, delete_quotationitem, view_quotation, get_all_quotation } = require('../controller/qutation');

const router = express.Router();


router.post('/create_quotation', adminAuth("Quotation:create_quotation"), validation('create_quotation'), create_quotation);
router.post('/create_quatationItem',adminAuth("Quotation:create_quatationItem"),validation('create_quotationitem'), create_quotationItem);
router.put('/update_quotation/:id', adminAuth("Quotation:update_quotation"), update_quotation);
router.put('/update_quotationItem/:id', adminAuth("Quotation:update_quotationItem"), update_quotationItem);
router.delete('/delete_quotation/:id', adminAuth("Quotation:delete_quotation"), delete_quotation);
router.delete('/delete_quotationitem/:id', adminAuth("Quotation:delete_quotationitem"), delete_quotationitem);
router.get('/view_quotation/:id', adminAuth("Quotation:view_single_quotation"), view_quotation);
router.get('/get_all_quotation', adminAuth("Quotation:view_all_quotation"), get_all_quotation);


module.exports = router;