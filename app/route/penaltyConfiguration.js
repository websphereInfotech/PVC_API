const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_penaltyConfiguration, update_penaltyConfiguration, get_penaltyConfigurations, get_penaltyConfiguration, delete_penaltyConfiguration } = require("../controller/penaltyConfiguration");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post("/create_penalty_configuration", create_penaltyConfiguration);
router.put("/update_penalty_configuration", update_penaltyConfiguration);
router.get("/view_all_penalty_configurations", get_penaltyConfigurations);
router.get("/view_penalty_configuration/:id", get_penaltyConfiguration);
router.delete("/delete_penalty_configuration/:id", delete_penaltyConfiguration);

module.exports = router;
