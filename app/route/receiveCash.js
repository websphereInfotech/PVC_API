const express = require('express');
const { C_create_receiveCash, C_get_all_receiveCash, C_view_receiveCash, C_update_receiveCash, C_delete_receiveCash } = require('../controller/receiveCash');
const adminAuth = require('../middleware/adminAuth');
const { validation } = require('../constant/validate');
const router = express.Router();

router.post('/C_create_receiveCash',adminAuth('Receive Cash:create_receive_Cash'),validation('create_receiveCash'),C_create_receiveCash);
router.get('/C_get_all_receiveCash',adminAuth('Receive Cash:view_all_receive_Cash'),C_get_all_receiveCash);
router.get('/C_view_receiveCash/:id',adminAuth('Receive Cash:view_receive_Cash'),C_view_receiveCash);
router.put('/C_update_receiveCash/:id',adminAuth('Receive Cash:update_receive_Cash'),C_update_receiveCash);
router.delete('/C_delete_receiveCash/:id',adminAuth('Receive Cash:delete_receive_Cash'),C_delete_receiveCash);

module.exports = router;