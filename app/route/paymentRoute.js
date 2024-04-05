const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_payment, update_payment, delete_payment, view_payment, get_all_payment } = require('../controller/admincontroller');


const router = express.Router();


router.post('/create_payment', adminAuth, validation('create_payment'), create_payment);
router.put('/update_payment/:id', adminAuth, update_payment);
router.delete('/delete_payment/:id', adminAuth, delete_payment);
router.get('/view_payment/:id', adminAuth, view_payment);
router.get('/get_all_payment', adminAuth, get_all_payment);


module.exports = router;