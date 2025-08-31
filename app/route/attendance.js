const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_attendance, get_all_attendances, get_attendance_by_id, approve_attendance, update_attendance, get_monthly_attendance_performance_metrics, manage_employee_attendance, update_attendance_type, get_employee_attendance_status, get_full_month_employee_attendance } = require("../controller/attendance");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_attendances", adminAuth("Attendance:create_attendance"), create_attendance);
router.get("/view_all_attendances", adminAuth("Attendance:view_all_attendance"), get_all_attendances);
router.get("/view_attendance/:id", get_attendance_by_id);
router.post("/approve_attendance/:id", adminAuth("Attendance:update_attendance"), approve_attendance);
router.put("/update_attendance/:id", adminAuth("Attendance:update_attendance"), update_attendance);
router.put("/update_attendance_type/:id", adminAuth("Attendance:update_attendance"), update_attendance_type);
router.get("/employee_status", adminAuth("Attendance:view_all_attendance"), get_employee_attendance_status);
router.get("/full_month_attendance", adminAuth("Attendance:view_all_attendance"), get_full_month_employee_attendance);
router.get("/performance_metrics", get_monthly_attendance_performance_metrics);
router.post("/manage_attendance", manage_employee_attendance);

module.exports = router;
