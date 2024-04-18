const express = require('express');
const { get_all_permissions } = require('../controller/permissions');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();


router.get('/get_all_permissions',get_all_permissions);
module.exports = router;