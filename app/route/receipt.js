const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_receipt, update_receipt, delete_receipt, view_receipt, get_all_receipt } = require('../controller/receipt');



const router = express.Router();


router.post('/create_receipt', adminAuth, validation('create_receipt'), create_receipt);
router.put('/update_receipt/:id', adminAuth, update_receipt);
router.delete('/delete_receipt/:id', adminAuth, delete_receipt);
router.get('/view_receipt/:id', adminAuth, view_receipt);
router.get('/get_all_receipt', adminAuth, get_all_receipt);


module.exports = router;