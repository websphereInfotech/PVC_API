const express = require("express");
const {
  create_creditNote,
  update_creditNote,
  get_all_creditNote,
  delete_creditNote,
  view_single_creditNote,
} = require("../controller/creditNote");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

router.post(
  "/create_creditNote",
  adminAuth("Credit Note:create_creditNote"),
  validation("create_creditNote"),
  create_creditNote
);
router.put(
  "/update_creditNote/:id",
  adminAuth("Credit Note:update_creditNote"),
  validation("update_creditNote"),
  update_creditNote
);
router.get(
  "/get_all_creditNote",
  adminAuth("Credit Note:view_all_creditNote"),
  get_all_creditNote
);
router.get(
  "/view_single_creditNote/:id",
  adminAuth("Credit Note:view_single_creditNote"),
  view_single_creditNote
);
router.delete(
  "/delete_creditNote/:id",
  adminAuth("Credit Note:delete_creditNote"),
  delete_creditNote
);

module.exports = router;
