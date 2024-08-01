const {Router} = require("express");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");
const {create_machine_schedule, update_machine_schedule, view_machine_schedule, view_all_machine_schedule, delete_machine_schedule} = require("../controller/machineSchedule");

const router = Router();
router.post('/create_machine_schedule', adminAuth("Machine Schedule:create_machine_schedule"), validation('machine_schedule_validation'), create_machine_schedule);
router.put('/update_machine_schedule/:id', adminAuth("Machine Schedule:update_machine_schedule"), validation('machine_schedule_validation'), update_machine_schedule);
router.get('/view_machine_schedule/:id', adminAuth("Machine Schedule:view_machine_schedule"), view_machine_schedule);
router.get('/view_all_machine_schedule', adminAuth("Machine Schedule:view_all_machine_schedule"), view_all_machine_schedule);
router.delete('/delete_machine_schedule/:id', adminAuth("Machine Schedule:delete_machine_schedule"), delete_machine_schedule);

module.exports = router;