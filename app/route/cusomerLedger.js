const express = require("express");
const {
  C_get_customerLedger,
  get_customerLedger,
  get_customerLedgerPdf,
  C_get_customerLedgerPdf
} = require("../controller/customerLedger");
const adminToken = require("../middleware/adminAuth");

const router = express.Router();

router.get(
  "/C_get_customerLedger/:id",
  adminToken("Customer Ledger Cash:View_Cash_customer_Ledger"),
  C_get_customerLedger
);

router.get(
    "/C_get_customerLedger_pdf/:id",
    adminToken("Customer Ledger Cash:Pdf_Download"),
    C_get_customerLedgerPdf
);

router.get(
  "/get_customerLedger/:id",
  adminToken("Customer Ledger:View_customer_Ledger"),
  get_customerLedger
);

router.get(
    "/get_customerLedger_pdf/:id",
    adminToken("Customer Ledger:Pdf_Download"),
    get_customerLedgerPdf
);
module.exports = router;
