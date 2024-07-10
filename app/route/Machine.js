const {Router} = require("express");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");
const {create_machine} = require("../controller/Machine");

const router = Router();

router.post("create_machine", adminAuth("Machine:create_machine"),validation("create_machine"), create_machine)

module.exports = router;