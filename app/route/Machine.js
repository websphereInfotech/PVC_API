const {Router} = require("express");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");
const {create_machine, view_all_machine, view_one_machine, update_machine, delete_machine} = require("../controller/Machine");

const router = Router();

router.post("/create_machine", adminAuth("Machine:create_machine"),validation("create_machine"), create_machine);
router.get('/view_all_machine', adminAuth("Machine:view_all_machine"), view_all_machine);
router.get('/view_one_machine/:machineId', adminAuth("Machine:view_one_machine"),view_one_machine)
router.put('/update_machine/:machineId', adminAuth("Machine:update_machine"), validation('create_machine'),update_machine)
router.delete('/delete_machine/:machineId', adminAuth("Machine:delete_machine"), delete_machine);


router.post('/schedule/create_machine_schedule')

module.exports = router;