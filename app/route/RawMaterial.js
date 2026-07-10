const express = require("express");
const router = express.Router();
const rawMaterialController = require("../controller/RawMaterial");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");

router.get(
    "/view/:id",
    adminAuth("RawMaterial:view_all"),
    rawMaterialController.view
);
router.get(
    "/:businessId",
    adminAuth("RawMaterial:view_all"),      
    rawMaterialController.getAllByBusiness 
);
router.post(
    "/",
    adminAuth("RawMaterial:create"),
    validation("create_raw_material"),
    rawMaterialController.create
);
router.put(
    "/:id",
    adminAuth("RawMaterial:update"),
    validation("update_raw_material"),
    rawMaterialController.update
);
router.delete(
    "/:id", 
    adminAuth("RawMaterial:delete"),
    rawMaterialController.delete
);

module.exports = router;
