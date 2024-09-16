const { Router } = require("express");
const {
  create_maintenance,
  view_all_maintenance,
  update_maintenance,
  view_one_maintenance,
  delete_maintenance,
} = require("../controller/maintenance");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const router = Router();
router.post(
  "/create_maintenance",
  adminAuth("Maintenance:create_maintenance"),
  validation("maintenance_validation"),
  create_maintenance
);
router.put(
  "/update_maintenance/:id",
  adminAuth("Maintenance:update_maintenance"),
  validation("maintenance_validation"),
  update_maintenance
);
router.get(
  "/view_all_maintenance",
  adminAuth("Maintenance:view_all_maintenance"),
  view_all_maintenance
);
router.get(
  "/view_one_maintenance/:id",
  adminAuth("Maintenance:view_one_maintenance"),
  view_one_maintenance
);
router.delete(
  "/delete_maintenance/:id",
  adminAuth("Maintenance:delete_maintenance"),
  delete_maintenance
);
module.exports = router;
