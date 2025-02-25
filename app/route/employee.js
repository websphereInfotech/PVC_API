const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_employee, update_employee, get_all_employees, get_employee, delete_employee, change_password, employee_login } = require("../controller/employee");
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

module.exports = router;