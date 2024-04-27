const express = require('express');
const { create_user, get_all_user, delete_user, update_user, user_login, reset_password, view_user } = require('../controller/user');
const adminAuth = require('../middleware/adminAuth');
const { validation } = require('../views/validate');
const router = express.Router();

router.post('/create_user',adminAuth("Login:create_user"),validation('create_user'),create_user);
router.get('/get_all_user',adminAuth("Login:delete_user"),get_all_user);
router.get('/view_user/:id',adminAuth("Login:"),view_user);
router.delete('/delete_user/:id',adminAuth("Login:view_all_user"),delete_user);
router.put('/update_user/:id',adminAuth("Login:update_user"),update_user);
router.post('/user_login',user_login);
router.post('/reset_password/:id',adminAuth('Login:reset_password'),reset_password);

module.exports = router;