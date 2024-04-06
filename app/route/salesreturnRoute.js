const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_salesReturn, get_all_salesReturn } = require('../controller/salesReturn');

const router = express.Router();

router.post('/create_salesReturn', adminAuth, validation('create_salesReturn'), create_salesReturn);
router.get('/get_all_salesReturn', adminAuth, get_all_salesReturn);

module.exports = router;