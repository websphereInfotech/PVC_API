const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purpose,
  update_purpose,
  get_all_purpose,
  view_purpose,
  delete_purpose,
} = require("../controller/purpose");

const router = express.Router();

router.post(
  "/create_purpose",
  adminAuth("Purpose:create_purpose"),
  validation("purpose_validation"),
  create_purpose
);

router.put(
  "/update_purpose/:id",
  adminAuth("Purpose:update_purpose"),
  validation("purpose_validation"),
  update_purpose
);
router.get(
  "/view_purpose/:id",
  adminAuth("Purpose:view_single_purpose"),
  view_purpose
);
router.get(
  "/get_all_purpose",
  adminAuth("Purpose:view_all_purpose"),
  get_all_purpose
);

router.delete(
  "/delete_purpose/:id",
  adminAuth("Purpose:delete_purpose"),
  delete_purpose
);

module.exports = router;
