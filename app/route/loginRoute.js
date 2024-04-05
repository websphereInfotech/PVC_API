const express = require('express');
const router = express.Router();
const { validation } = require('../views/validate');
const { admin_login } = require('../controller/admincontroller');

router.post('/admin_login',validation('userLogin'),admin_login);

module.exports = router;