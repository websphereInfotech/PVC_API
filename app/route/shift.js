const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_shift, update_shift, get_shifts, get_shift, delete_shift } = require("../controller/shift");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_shift", create_shift);
router.put("/update_shift/:id", update_shift);
router.get("/view_all_shift", get_shifts);
router.get("/view_shift/:id", get_shift);
router.delete("/delete_shift/:id", delete_shift);

module.exports = router;
