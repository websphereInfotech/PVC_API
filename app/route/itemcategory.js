const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_itemcategory, update_itemcategory, view_itemcategory, get_all_itemcategory } = require('../controller/itemCategory');

const router = express.Router();


router.post('/create_itemcategory', adminAuth("Item Category:create_itemcategory"), validation('create_itemcategory'), create_itemcategory);
router.put('/update_itemcategory/:id', adminAuth("Item Category:update_itemcategory"), update_itemcategory);
router.get('/view_itemcategory/:id', adminAuth("Item Category:view_single_itemcategory"), view_itemcategory);
router.get('/get_all_itemcategory', adminAuth("Item Category:view_all_itemcategory"), get_all_itemcategory);


module.exports = router;