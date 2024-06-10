const express = require("express");
const {
  get_all_company,
  create_company,
  update_company,
  delete_company,
  view_single_company,
  set_default_comapny,
  view_company_balance,
  view_company_cash_balance,
  view_single_bank_balance,
} = require("../controller/company");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post(
  "/create_company",
  adminAuth("Company:create_company"),
  validation("create_company"),
  create_company
);
router.put(
  "/update_company/:id",
  adminAuth("Company:update_company"),
  validation("update_company"),
  update_company
);
router.delete(
  "/delete_company/:id",
  adminAuth("Company:delete_company"),
  delete_company
);
router.get(
  "/get_all_company",
  adminAuth("Company:view_all_company"),
  get_all_company
);
router.get(
  "/view_single_company/:id",
  adminAuth("Company:view_single_company"),
  view_single_company
);
router.get(
  "/set_default_comapny/:id",
  adminAuth("Company:set_default_comapny"),
  set_default_comapny
);

router.get(
  "/view_company_balance",
  adminAuth("Company:view_company_balance"),
  view_company_balance
);
router.get(
  "/view_single_bank_balance/:id",
  adminAuth("Company:view_single_bank_balance"),
  view_single_bank_balance
);
router.get(
  "/view_company_cash_balance",
  adminAuth("Company Cash:view_company_cash_balance"),
  view_company_cash_balance
);
module.exports = router;
