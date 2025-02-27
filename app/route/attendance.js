const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_attendance, get_all_attendances, get_attendance_by_id, approve_attendance, update_attendance, get_monthly_attendance_performance_metrics } = require("../controller/attendance");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_attendances", create_attendance);
router.get("/view_all_attendances", get_all_attendances);
router.get("/view_attendance/:id", get_attendance_by_id);
router.post("/approve_attendance/:id", approve_attendance);
router.put("/update_attendance/:id", update_attendance);
router.get("/performance_metrics", get_monthly_attendance_performance_metrics);

module.exports = router;
