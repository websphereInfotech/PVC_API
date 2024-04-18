const express = require('express');
const router = express.Router();
const { validation } = require('../views/validate');
const { admin_login, user_signup, user_login } = require('../controller/admincontroller');

router.post('/admin_login',validation('userLogin'),admin_login);
router.post('/user_signup',user_signup);
router.post('/user_login',user_login);
module.exports = router;