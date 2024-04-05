const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_customer, update_customer, delete_customer, create_customfeild, update_customfeild, delete_customfeild, view_customer, get_all_customer } = require('../controller/admincontroller');


const router = express.Router();


router.post('/create_customer', adminAuth, validation('create_customer'), create_customer);
router.post('/create_customfeild', adminAuth, validation('create_customfeild'), create_customfeild);
router.put('/update_customer/:id', adminAuth, update_customer);
router.put('/update_customfeild/:id', adminAuth, update_customfeild);
router.delete('/delete_customer/:id', adminAuth, delete_customer);
router.delete('/delete_customfeild/:id', adminAuth, delete_customfeild);
router.get('/view_customer/:id', adminAuth, view_customer);
router.get('/get_all_customer', adminAuth, get_all_customer);


module.exports = router;