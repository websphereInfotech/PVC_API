const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_deliverychallan, create_deliverychallanitem, update_deliverychallan, update_deliverychallanitem, delete_deliverychallan, delete_deliverychallanitem, view_deliverychallan, get_all_deliverychallan } = require('../controller/deliveryChallan');


const router = express.Router();


router.post('/create_deliverychallan', adminAuth("Delivery Challan:create_deliverychallan"), validation('create_deliverychallan'), create_deliverychallan);
router.post('/create_deliverychallanitem', adminAuth("Delivery Challan:create_deliverychallanitem"), validation('create_deliverychallanitem'), create_deliverychallanitem);
router.put('/update_deliverychallan/:id', adminAuth("Delivery Challan:update_deliverychallan"), update_deliverychallan);
router.put('/update_deliverychallanitem/:id', adminAuth("Delivery Challan:update_deliverychallanitem"), update_deliverychallanitem);
router.delete('/delete_deliverychallan/:id', adminAuth("Delivery Challan:delete_deliverychallan"), delete_deliverychallan);
router.delete('/delete_deliverychallanitem/:id', adminAuth("Delivery Challan:delete_deliverychallanitem"), delete_deliverychallanitem);
router.get('/view_deliverychallan/:id', adminAuth("Delivery Challan:view_single_deliverychallan"), view_deliverychallan);
router.get('/get_all_deliverychallan', adminAuth("Delivery Challan:view_all_deliverychallan"), get_all_deliverychallan);


module.exports = router;