const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_purchaseReturn, create_purchaseReturn_item, update_purchaseReturn, update_purchaseReturn_item, delete_purchasereturn, delete_purchaseReturn_item, view_purchaseReturn, get_all_purchaseReturn } = require('../controller/purchaseReturn');

const router = express.Router();


router.post('/create_purchaseReturn', adminAuth, validation('create_purchaseReturn'), create_purchaseReturn);
router.post('/create_purchaseReturn_item', adminAuth, validation('create_purchaseReturn_item'), create_purchaseReturn_item);
router.put('/update_purchaseReturn/:id', adminAuth, update_purchaseReturn);
router.put('/update_purchaseReturn_item/:id', adminAuth, update_purchaseReturn_item);
router.delete('/delete_purchasereturn/:id', adminAuth, delete_purchasereturn);
router.delete('/delete_purchaseReturn_item/:id', adminAuth, delete_purchaseReturn_item);
router.get('/view_purchaseReturn/:id', adminAuth, view_purchaseReturn);
router.get('/get_all_purchaseReturn', adminAuth, get_all_purchaseReturn);


module.exports = router;