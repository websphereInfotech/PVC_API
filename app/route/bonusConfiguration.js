const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_bonusConfiguration, update_bonusConfiguration, get_bonusConfigurations, get_bonusConfiguration, delete_bonusConfiguration } = require("../controller/bonusConfiguration");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_bonus_configuration", create_bonusConfiguration);
router.put("/update_bonus_configuration/:id", update_bonusConfiguration);
router.get("/view_all_bonus_configurations", get_bonusConfigurations);
router.get("/view_bonus_configuration/:id", get_bonusConfiguration);
router.delete("/delete_bonus_configuration/:id", delete_bonusConfiguration);

module.exports = router;
