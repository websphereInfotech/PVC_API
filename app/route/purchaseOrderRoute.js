const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_purchaseitem, create_purchase, update_purchaseitem, update_purchase, delete_purchase, delete_purchaseitem, view_purchase, get_all_purchase } = require('../controller/admincontroller');

const router = express.Router();


router.post('/create_purchase', adminAuth, validation('create_purchase'), create_purchase);
router.post('/create_purchaseitem', adminAuth, validation('create_purchaseitem'), create_purchaseitem);
router.put('/update_purchase/:id', adminAuth, update_purchase);
router.put('/update_purchaseitem/:id', adminAuth, update_purchaseitem);
router.delete('/delete_purchase/:id', adminAuth, delete_purchase);
router.delete('/delete_purchaseitem/:id', adminAuth, delete_purchaseitem);
router.get('/view_purchase/:id', adminAuth, view_purchase);
router.get('/get_all_purchase', adminAuth, get_all_purchase);


module.exports = router;