const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_purchaseReturn } = require('../controller/admincontroller');

const router = express.Router();


router.post('/create_purchaseReturn', adminAuth, validation('create_purchaseReturn'), create_purchaseReturn);
router.post('/create_purchaseReturn_item', adminAuth, validation('create_purchaseReturn_item'), create_purchaseReturn);
// router.put('/update_purchase/:id', adminAuth, update_purchase);
// router.put('/update_purchaseitem/:id', adminAuth, update_purchaseitem);
// router.delete('/delete_purchase/:id', adminAuth, delete_purchase);
// router.delete('/delete_purchaseitem/:id', adminAuth, delete_purchaseitem);
// router.get('/view_purchase/:id', adminAuth, view_purchase);
// router.get('/get_all_purchase', adminAuth, get_all_purchase);


module.exports = router;