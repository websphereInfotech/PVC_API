const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_stockitem, get_all_stock } = require('../controller/stock');


const router = express.Router();


router.post('/create_stockitem', adminAuth("Stock:create_stockitem"), validation('create_stoke'), create_stockitem);
router.get('/get_all_stock', adminAuth("Stock:view_all_stock"), get_all_stock);


module.exports = router;