const express = require("express");
const {
  delete_company_bankDetails,
  update_company_bankDetails,
  create_company_bankDetails,
  view_company_bankDetails,
  view_all_company_bankDetails,
  view_company_bankLedger,
} = require("../controller/companyBankDetails");
const { validation } = require("../constant/validate");
const adminToken = require("../middleware/adminAuth");

const router = express.Router();

router.post(
  "/create_company_bankDetails",
  adminToken("Company Bank Details:create_company_bankDetails"),
  validation("create_company_bankDetails"),
  create_company_bankDetails
);
router.put(
  "/update_company_bankDetails/:id",
  adminToken("Company Bank Details:update_company_bankDetails"),
  update_company_bankDetails
);
router.delete(
  "/delete_company_bankDetails/:id",
  adminToken("Company Bank Details:delete_company_bankDetails"),
  delete_company_bankDetails
);
router.get(
  "/view_company_bankDetails/:id",
  adminToken("Company Bank Details:view_company_bankDetails"),
  view_company_bankDetails
);
router.get(
  "/view_all_company_bankDetails",
  adminToken("Company Bank Details:view_all_company_bankDetails"),
  view_all_company_bankDetails
);

router.get('/view_company_bankLedger',adminToken("Company Bank Details:view_company_bankLedger"),view_company_bankLedger);
module.exports = router;
