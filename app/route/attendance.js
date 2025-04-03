const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_attendance, get_all_attendances, get_attendance_by_id, approve_attendance, update_attendance, get_monthly_attendance_performance_metrics, manage_employee_attendance } = require("../controller/attendance");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_attendances", adminAuth("Attendance:create_attendence"), create_attendance);
router.get("/view_all_attendances", adminAuth("Attendance:view_all_attendence"), get_all_attendances);
router.get("/view_attendance/:id", get_attendance_by_id);
router.post("/approve_attendance/:id", adminAuth("Attendance:update_attendence"), approve_attendance);
router.put("/update_attendance/:id", adminAuth("Attendance:update_attendence"), update_attendance);
router.get("/performance_metrics", get_monthly_attendance_performance_metrics);
router.post("/manage_attendance", manage_employee_attendance);

module.exports = router;
