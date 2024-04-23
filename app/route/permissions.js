const express = require("express");
const {
  get_all_permissions,
  update_permissions,
} = require("../controller/permissions");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get(
  "/get_all_permissions",
  adminAuth("Permission:view_all_permissions"),
  get_all_permissions
);
router.put(
  "/update_permissions",
  adminAuth("Permission:update_permissions"),
  update_permissions
);
module.exports = router;
