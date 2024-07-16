const express = require("express");
const {
  C_get_vendorLedger,
  get_vendorLedger,
  get_vendorLedgerPDF,
  C_get_vendorLedgerPdf
} = require("../controller/vendorLedger");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get(
  "/C_get_vendorLedger/:id",
  adminAuth("Vendor Ledger Cash:View_Cash_vendor_Ledger"),
  C_get_vendorLedger
);

router.get(
    "/C_get_vendorLedger_pdf/:id",
    adminAuth("Vendor Ledger Cash:View_Cash_vendor_Ledger"),
    C_get_vendorLedgerPdf
);

router.get(
  "/get_vendorLedger/:id",
  adminAuth("Vendor Ledger:View_vendor_Ledger"),
  get_vendorLedger
);

router.get('/get_vendorLedger_pdf/:id',adminAuth("Vendor Ledger:View_vendor_Ledger"),get_vendorLedgerPDF)

module.exports = router;
