const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_stockitem, get_all_stock } = require('../controller/admincontroller');

const router = express.Router();


router.post('/create_stockitem', adminAuth, validation('create_stoke'), create_stockitem);
router.get('/get_all_stock', adminAuth, get_all_stock);


module.exports = router;