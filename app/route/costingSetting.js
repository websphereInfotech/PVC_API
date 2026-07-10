const express = require("express");
const router = express.Router();
const costingSettingController = require("../controller/costingSetting");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");

router.get(
  "/product-pricing",
  costingSettingController.getProductPricing
);

router.get(
  "/scope",
  adminAuth("Costing Setting:view_all"),
  costingSettingController.getByScope
);

router.put(
  "/scope",
  adminAuth("Costing Setting:update"),
  validation("update_costing_setting"),
  costingSettingController.saveByScope
);

router.get(
  "/business/:businessId",
  adminAuth("Costing Setting:view_all"),
  costingSettingController.getAllByBusiness
);

router.get(
  "/:id",
  adminAuth("Costing Setting:view"),
  costingSettingController.getById
);

router.post(
  "/",
  adminAuth("Costing Setting:create"),
  validation("create_costing_setting"),
  costingSettingController.create
);

router.put(
  "/:id",
  adminAuth("Costing Setting:update"),
  validation("update_costing_setting"),
  costingSettingController.update
);

router.delete(
  "/:id",
  adminAuth("Costing Setting:delete"),
  costingSettingController.delete
);

module.exports = router;
