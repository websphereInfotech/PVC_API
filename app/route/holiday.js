const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_holiday, update_holiday, get_holidays, get_holiday, delete_holiday } = require("../controller/holiday");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_holiday", adminAuth("Holiday:create_holiday"), create_holiday);
router.put("/update_holiday/:id", adminAuth("Holiday:update_holiday"), update_holiday);
router.get("/view_all_holidays", adminAuth("Holiday:view_holiday"), get_holidays);
router.get("/view_holiday/:id", adminAuth("Holiday:view_holiday"), get_holiday);
router.delete("/delete_holiday/:id", adminAuth("Holiday:delete_holiday"), delete_holiday);

module.exports = router;
