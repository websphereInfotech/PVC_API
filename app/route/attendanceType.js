const { Router } = require("express");
const router = Router();
const attendanceTypeController = require("../controller/attendanceType");
const adminAuth = require("../middleware/adminAuth");

/*=============================================================================================================
                                          Attendance Type Routes
 ============================================================================================================ */

// Create new attendance type
router.post("/", adminAuth("Attendance:create_attendance"), attendanceTypeController.create_attendance_type);

// Get all attendance types with pagination and search
router.get("/", adminAuth("Attendance:create_attendance"), attendanceTypeController.get_all_attendance_types);

// Get attendance type by ID
router.get("/:id", adminAuth("Attendance:create_attendance"), attendanceTypeController.get_attendance_type_by_id);

// Update attendance type
router.put("/:id", adminAuth("Attendance:create_attendance"), attendanceTypeController.update_attendance_type);

// Delete attendance type
router.delete("/:id", adminAuth("Attendance:create_attendance"), attendanceTypeController.delete_attendance_type);

// Get attendance types for dropdown (without pagination)
router.get("/dropdown/list", adminAuth("Attendance:create_attendance"), attendanceTypeController.get_attendance_types_dropdown);

module.exports = router;
