const {Router} = require('express');
const {create_regular_maintenance, update_regular_maintenance, view_all_regular_maintenance, view_one_regular_maintenance, delete_regular_maintenance} = require("../controller/regularMaintenace");
const {validation} = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const router = new Router();
router.post('/create_regular_maintenance',adminAuth("Regular Maintenance:create_regular_maintenance"), validation('create_regular_maintenance'), create_regular_maintenance)
router.put('/update_regular_maintenance/:id',adminAuth("Regular Maintenance:update_regular_maintenance"), validation('create_regular_maintenance'), update_regular_maintenance)
router.get('/view_all_regular_maintenance',adminAuth("Regular Maintenance:view_all_regular_maintenance"), view_all_regular_maintenance)
router.get('/view_one_regular_maintenance/:id',adminAuth("Regular Maintenance:view_one_regular_maintenance"), view_one_regular_maintenance)
router.delete('/delete_regular_maintenance/:id',adminAuth("Regular Maintenance:delete_regular_maintenance"), delete_regular_maintenance)
module.exports = router;