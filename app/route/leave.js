const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_leave_request, update_leave_request, get_leave_requests, get_leave_request, delete_leave_Request, approve_reject_leave_Request, get_total_leaves } = require("../controller/leave");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_leave_request", create_leave_request);
router.put("/update_leave_request/:id", update_leave_request);
router.get("/view_all_leave_requests", get_leave_requests);
router.get("/view_leave_request/:id", get_leave_request);
router.delete("/delete_leave_request/:id", delete_leave_Request);
router.post("/update_leave_request_status/:id", approve_reject_leave_Request);
router.get("/view_total_leaves", get_total_leaves);

module.exports = router;