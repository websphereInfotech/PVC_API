const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_purchasebill, create_purchasebill_item, update_purchasebill, update_purchasebill_item, delete_purchasebill, delete_purchasebill_item, get_all_purchasebill, view_purchasebill } = require('../controller/admincontroller');

const router = express.Router();


router.post('/create_purchasebill', adminAuth, validation('create_purchasebill'), create_purchasebill);
router.post('/create_purchasebill_item', adminAuth, validation('create_purchasebill_item'), create_purchasebill_item);
router.put('/update_purchasebill/:id', adminAuth, update_purchasebill);
router.put('/update_purchasebill_item/:id', adminAuth, update_purchasebill_item);
router.delete('/delete_purchasebill/:id', adminAuth, delete_purchasebill);
router.delete('/delete_purchasebill_item/:id', adminAuth, delete_purchasebill_item);
router.get('/view_purchasebill/:id', adminAuth, view_purchasebill);
router.get('/get_all_purchasebill', adminAuth, get_all_purchasebill);


module.exports = router;