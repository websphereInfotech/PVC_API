const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");

const { create_ProFormaInvoice, get_all_ProFormaInvoice, view_ProFormaInvoice, update_ProFormaInvoice, delete_ProFormaInvoice } = require("../controller/ProFormaInvoice");

const router = express.Router();

router.post(
  "/create_ProFormaInvoice",
  adminAuth("ProFormaInvoice:create_ProFormaInvoice"),
  validation("create_ProFormaInvoice"),
  create_ProFormaInvoice
);
router.put(
  "/update_ProFormaInvoice/:id",
  adminAuth("ProFormaInvoice:update_ProFormaInvoice"),
  validation("update_ProFormaInvoice"),
  update_ProFormaInvoice
);
router.delete(
  "/delete_ProFormaInvoice/:id",
  adminAuth("ProFormaInvoice:delete_ProFormaInvoice"),
  delete_ProFormaInvoice
);

router.get(
  "/view_single_ProFormaInvoice/:id",
  adminAuth("ProFormaInvoice:view_single_ProFormaInvoice"),
  view_ProFormaInvoice
);
router.get(
  "/get_all_ProFormaInvoice",
  adminAuth("ProFormaInvoice:view_all_ProFormaInvoice"),
  get_all_ProFormaInvoice
);

module.exports = router;
