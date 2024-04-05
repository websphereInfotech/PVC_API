const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_unit, update_unit, view_unit, get_all_unit } = require('../controller/admincontroller');

const router = express.Router();


router.post('/create_unit', adminAuth, validation('create_unit'), create_unit);
router.put('/update_unit/:id', adminAuth, update_unit);
router.get('/view_unit/:id', adminAuth, view_unit);
router.get('/get_all_unit', adminAuth, get_all_unit);


module.exports = router;