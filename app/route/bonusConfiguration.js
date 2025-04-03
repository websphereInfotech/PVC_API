const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_bonusConfiguration, update_bonusConfiguration, get_bonusConfigurations, get_bonusConfiguration, delete_bonusConfiguration } = require("../controller/bonusConfiguration");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_bonus_configuration", adminAuth("Bonus Config:create_bonus"), create_bonusConfiguration);
router.put("/update_bonus_configuration", adminAuth("Bonus Config:update_bonus"), update_bonusConfiguration);
router.get("/view_all_bonus_configurations", adminAuth("Bonus Config:view_bonus"), get_bonusConfigurations);
router.get("/view_bonus_configuration/:id", adminAuth("Bonus Config:view_bonus"), get_bonusConfiguration);
router.delete("/delete_bonus_configuration/:id", adminAuth("Bonus Config:delete_bonus"), delete_bonusConfiguration);

module.exports = router;
