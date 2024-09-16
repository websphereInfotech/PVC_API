const { Router } = require("express");
const { create_maintenance } = require("../controller/maintenance");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const router = Router();
router.post(
  "/create_maintenance",
  adminAuth("Maintenance:create_maintenance"),
  validation("maintenance_validation"),
  create_maintenance
);

module.exports = router;
