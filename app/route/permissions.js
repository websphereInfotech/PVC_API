const express = require('express');
const { get_all_permissions, update_permissions } = require('../controller/permissions');


const router = express.Router();


router.get('/get_all_permissions',get_all_permissions);
router.put('/update_permissions',update_permissions);
module.exports = router;