const {Router} = require("express");
const {view_all_salary, salary_status, add_salary_payment, edit_salary_payment, delete_salary_payment, view_all_salary_payment} = require("../controller/salary");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");

const router = Router();

router.get("/view_all_salary",adminAuth("Salary:view_all_salary"), view_all_salary);
// router.get('/salary_status/:id', adminAuth('Salary:salary_status'), salary_status);

router.post('/add_salary_payment/:salaryId', adminAuth("Salary:add_salary_payment"), validation("add_salary_payment"), add_salary_payment);
router.put('/edit_salary_payment/:salaryPaymentId', adminAuth("Salary:edit_salary_payment"), validation("add_salary_payment"), edit_salary_payment);
router.delete('/delete_salary_payment/:salaryPaymentId', adminAuth("Salary:delete_salary_payment"), delete_salary_payment);
router.get('/view_all_salary_payment/:salaryId', adminAuth("Salary:view_all_salary_payment"), view_all_salary_payment);

module.exports = router;