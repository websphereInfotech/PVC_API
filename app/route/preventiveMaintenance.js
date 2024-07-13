const {Router} = require('express');
const {create_preventive_maintenance, update_preventive_maintenance, view_all_preventive_maintenance, view_one_preventive_maintenance, delete_preventive_maintenance} = require("../controller/preventiveMaintenance");
const {validation} = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const router = new Router();
router.post('/create_preventive_maintenance',adminAuth("Preventive Maintenance:create_preventive_maintenance"), validation('create_preventive_maintenance'), create_preventive_maintenance)
router.put('/update_preventive_maintenance/:id',adminAuth("Preventive Maintenance:update_preventive_maintenance"), validation('create_preventive_maintenance'), update_preventive_maintenance)
router.get('/view_all_preventive_maintenance',adminAuth("Preventive Maintenance:view_all_preventive_maintenance"), view_all_preventive_maintenance)
router.get('/view_one_preventive_maintenance/:id',adminAuth("Preventive Maintenance:view_one_preventive_maintenance"), view_one_preventive_maintenance)
router.delete('/delete_preventive_maintenance/:id',adminAuth("Preventive Maintenance:delete_preventive_maintenance"), delete_preventive_maintenance)
module.exports = router;