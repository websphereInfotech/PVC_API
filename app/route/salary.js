const {Router} = require("express");
const {view_all_salary, salary_status} = require("../controller/salary");
const adminAuth = require("../middleware/adminAuth");

const router = Router();

router.get("/view_all_salary",adminAuth("Salary:view_all_salary"), view_all_salary);
router.get('/salary_status/:id', adminAuth('Salary:salary_status'), salary_status);


module.exports = router;