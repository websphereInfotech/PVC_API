const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_penaltyConfiguration, update_penaltyConfiguration, get_penaltyConfigurations, get_penaltyConfiguration, delete_penaltyConfiguration } = require("../controller/penaltyConfiguration");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_penalty_configuration", adminAuth("Penalty Config:create_penalty"), create_penaltyConfiguration);
router.put("/update_penalty_configuration", adminAuth("Penalty Config:update_penalty"), update_penaltyConfiguration);
router.get("/view_all_penalty_configurations", adminAuth("Penalty Config:view_penalty"), get_penaltyConfigurations);
router.get("/view_penalty_configuration/:id", adminAuth("Penalty Config:view_penalty"), get_penaltyConfiguration);
router.delete("/delete_penalty_configuration/:id", adminAuth("Penalty Config:delete_penalty"), delete_penaltyConfiguration);

module.exports = router;
