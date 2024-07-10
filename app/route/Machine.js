const {Router} = require("express");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");
const {create_machine, view_all_machine, view_one_machine} = require("../controller/Machine");

const router = Router();

router.post("/create_machine", adminAuth("Machine:create_machine"),validation("create_machine"), create_machine);
router.get('/view_all_machine', adminAuth("Machine:view_all_machine"), view_all_machine);
router.get('/view_one_machine/:machineId', adminAuth("Machine:view_one_machine"),view_one_machine)
module.exports = router;