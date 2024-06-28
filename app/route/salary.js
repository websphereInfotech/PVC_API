const {Router} = require("express");
const {view_all_salary} = require("../controller/salary");
const adminAuth = require("../middleware/adminAuth");

const router = Router();

router.get("/view_all_salary",adminAuth("Salary:view_all_salary"), view_all_salary)


module.exports = router;