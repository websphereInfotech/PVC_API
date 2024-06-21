const {Router} = require('express');
const router = require("./bom");
const {view_all_notification} = require("../controller/notification");
const adminToken = require("../middleware/adminAuth");
const rotuer = Router()

router.get('/view_all_notification', adminToken("Notification:view_all_notification"), view_all_notification)

module.exports = router