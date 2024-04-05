const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_itemgroup, update_itemgroup, view_itemgroup, get_all_itemgroup } = require('../controller/admincontroller');


const router = express.Router();


router.post('/create_itemgroup', adminAuth, validation('create_itemgroup'), create_itemgroup);
router.put('/update_itemgroup/:id', adminAuth, update_itemgroup);
router.get('/view_itemgroup/:id', adminAuth, view_itemgroup);
router.get('/get_all_itemgroup', adminAuth, get_all_itemgroup);


module.exports = router;