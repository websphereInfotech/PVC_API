const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_salesInvoice,
  update_salesInvoice,
  delete_salesInvoice,
  view_salesInvoice,
  get_all_salesInvoice,
} = require("../controller/salesinvoice");

const router = express.Router();

router.post(
  "/create_salesinvoice",
  adminAuth("Sales Invoice:create_salesinvoice"),
  validation("create_salesinvoice"),
  create_salesInvoice
);

router.put(
  "/update_salesInvoice/:id",
  adminAuth("Sales Invoice:update_salesInvoice"),
  validation('update_salesInvoice'),
  update_salesInvoice
);
router.delete(
  "/delete_salesInvoice/:id",
  adminAuth("Sales Invoice:delete_salesInvoice"),
  delete_salesInvoice
);
router.get(
  "/view_salesInvoice/:id",
  adminAuth("Sales Invoice:view_single_salesInvoice"),
  view_salesInvoice
);
router.get(
  "/get_all_salesInvoice",
  adminAuth("Sales Invoice:view_all_salesInvoice"),
  get_all_salesInvoice
);

module.exports = router;
