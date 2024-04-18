const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_itemgroup, update_itemgroup, view_itemgroup, get_all_itemgroup } = require('../controller/itemGroup');

const router = express.Router();


router.post('/create_itemgroup', adminAuth("Item Group:create_itemgroup"), validation('create_itemgroup'), create_itemgroup);
router.put('/update_itemgroup/:id', adminAuth("Item Group:update_itemgroup"), update_itemgroup);
router.get('/view_itemgroup/:id', adminAuth("Item Group:view_single_itemgroup"), view_itemgroup);
router.get('/get_all_itemgroup', adminAuth("Item Group:view_all_itemgroup"), get_all_itemgroup);


module.exports = router;