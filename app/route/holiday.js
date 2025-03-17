const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_holiday, update_holiday, get_holidays, get_holiday, delete_holiday } = require("../controller/holiday");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_holiday", create_holiday);
router.put("/update_holiday/:id", update_holiday);
router.get("/view_all_holidays", get_holidays);
router.get("/view_holiday/:id", get_holiday);
router.delete("/delete_holiday/:id", delete_holiday);

module.exports = router;
