const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_product, update_product, delete_product, view_product, get_all_product } = require('../controller/admincontroller');


const router = express.Router();


router.post('/create_product', adminAuth, validation('create_product'), create_product);
router.put('/update_product/:id', adminAuth, update_product);
router.delete('/delete_product/:id', adminAuth, delete_product);
router.get('/view_product/:id', adminAuth, view_product);
router.get('/get_all_product', adminAuth, get_all_product);


module.exports = router;