const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_receipt,
  update_receipt,
  delete_receipt,
  view_receipt,
  get_all_receipt,
} = require("../controller/receipt");

const router = express.Router();

router.post(
  "/create_receipt",
  adminAuth("Receipt:create_receipt"),
  validation("create_receipt"),
  create_receipt
);
router.put(
  "/update_receipt/:id",
  adminAuth("Receipt:update_receipt"),
  update_receipt
);
router.delete(
  "/delete_receipt/:id",
  adminAuth("Receipt:delete_receipt"),
  delete_receipt
);
router.get(
  "/view_receipt/:id",
  adminAuth("Receipt:view_single_receipt"),
  view_receipt
);
router.get(
  "/get_all_receipt",
  adminAuth("Receipt:view_all_receipt"),
  get_all_receipt
);

module.exports = router;
