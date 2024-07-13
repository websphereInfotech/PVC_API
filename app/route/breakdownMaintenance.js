const {Router} = require('express');
const {create_breakdown_maintenance, update_breakdown_maintenance, view_all_breakdown_maintenance, view_one_breakdown_maintenance, delete_breakdown_maintenance} = require("../controller/breakdownMaintenance");
const {validation} = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const router = new Router();
router.post('/create_breakdown_maintenance',adminAuth("Breakdown Maintenance:create_breakdown_maintenance"), validation('create_breakdown_maintenance'), create_breakdown_maintenance)
router.put('/update_breakdown_maintenance/:id',adminAuth("Breakdown Maintenance:update_breakdown_maintenance"), validation('create_breakdown_maintenance'), update_breakdown_maintenance)
router.get('/view_all_breakdown_maintenance',adminAuth("Breakdown Maintenance:view_all_breakdown_maintenance"), view_all_breakdown_maintenance)
router.get('/view_one_breakdown_maintenance/:id',adminAuth("Breakdown Maintenance:view_one_breakdown_maintenance"), view_one_breakdown_maintenance)
router.delete('/delete_breakdown_maintenance/:id',adminAuth("Breakdown Maintenance:delete_breakdown_maintenance"), delete_breakdown_maintenance)
module.exports = router;