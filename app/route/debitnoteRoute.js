const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_debitNote,
  update_debitNote,
  get_all_debitNote,
  view_single_debitNote,
  delete_debitNote,
} = require("../controller/debitNote");

const router = express.Router();

router.post(
  "/create_debitNote",
  adminAuth("Debit Note:create_debitNote"),
  validation("create_debitNote"),
  create_debitNote
);
router.put(
  "/update_debitNote/:id",
  adminAuth("Debit Note:update_debitNote"),
  update_debitNote
);
router.get(
  "/get_all_debitNote",
  adminAuth("Debit Note:view_all_debitNote"),
  get_all_debitNote
);
router.get(
  "/view_single_debitNote/:id",
  adminAuth("Debit Note:view_single_debitNote"),
  view_single_debitNote
);
router.delete(
  "/delete_debitNote/:id",
  adminAuth("Debit Note:delete_debitNote"),
  delete_debitNote
);

module.exports = router;
