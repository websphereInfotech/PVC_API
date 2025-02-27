const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_employee, update_employee, get_all_employees, get_employee, delete_employee, change_password, employee_login, forgot_password, get_employee_salary_history, get_employee_bonus } = require("../controller/employee");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_employee", create_employee);
router.put("/update_employee/:id", update_employee);
router.get("/view_all_employees", get_all_employees);
router.get("/view_employee/:id", get_employee);
router.delete("/delete_employee/:id", delete_employee); 
router.post("/change_password/:id", change_password);
router.post("/login", employee_login);
router.post("/forgot_password", forgot_password);
router.get("/salary_history/:employeeId", get_employee_salary_history);
router.get("/bonus/:employeeId", get_employee_bonus);

module.exports = router;