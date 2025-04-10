const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_setting, delete_system_setting, get_system_setting, get_system_settings, update_setting, get_system_setting_by_name } = require("../controller/systemSettings");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_system_setting", adminAuth("System Setting:create_system_setting"), create_setting);
router.put("/update_system_setting/:id", adminAuth("System Setting:update_system_setting"), update_setting);
router.get("/view_all_system_setting", adminAuth("System Setting:view_system_setting"), get_system_settings);
router.get("/view_system_setting_by_name", adminAuth("System Setting:view_system_setting"), get_system_setting_by_name);
router.get("/view_system_setting/:id", adminAuth("System Setting:view_system_setting"), get_system_setting);
router.delete("/delete_system_setting/:id", adminAuth("System Setting:delete_system_setting"), delete_system_setting);

module.exports = router;
