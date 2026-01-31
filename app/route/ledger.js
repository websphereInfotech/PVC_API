const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  C_ledger_settlement,
  account_ledger,
  C_account_ledger,
  daybook,
  C_daybook,
  C_wallet_ledger,
  C_cashbook,
  account_ledger_pdf,
  account_ledger_jpg,
  C_account_ledger_pdf,
  C_passbook,
  account_ledger_excel,
  C_account_ledger_excel,
  C_account_ledger_jpg,
  C_account_ledger_html,
  account_ledger_html
} = require("../controller/ledger");

const router = express.Router();

router.post(
  "/C_ledger_settlement",
  adminAuth("Ledger:account_ledger"),
  validation("ledger_settlement"),
  C_ledger_settlement
);

router.get(
  "/account_ledger/:id",
  adminAuth("Ledger:account_ledger"),
  account_ledger
);

router.get(
  "/account_ledger_jpg/:id",
  adminAuth("Ledger:account_ledger_jpg"),
  account_ledger_jpg
);

router.get(
  "/account_ledger_excel/:id",
  adminAuth("Ledger:account_ledger_excel"),
  account_ledger_excel
);

router.get(
  "/account_ledger_html/:id",
  adminAuth("Ledger:account_ledger_html"),
  account_ledger_html
);

router.get(
  "/C_account_ledger/:id",
  adminAuth("Ledger Cash:account_ledger"),
  C_account_ledger
);

router.get(
  "/C_account_ledger_excel/:id",
  adminAuth("Ledger Cash:account_ledger_excel"),
  C_account_ledger_excel
);

router.get(
  "/C_account_ledger_jpg/:id",
  adminAuth("Ledger Cash:account_ledger_jpg"),
  C_account_ledger_jpg
);

router.get(
  "/C_account_ledger_html/:id",
  adminAuth("Ledger Cash:account_ledger_html"),
  C_account_ledger_html
);

router.get("/daybook", adminAuth("Ledger:daybook"), daybook);
router.get("/C_daybook", adminAuth("Ledger Cash:daybook"), C_daybook);

router.get(
  "/C_wallet_ledger",
  adminAuth("Ledger Cash:wallet_ledger"),
  C_wallet_ledger
);
router.get("/C_cashbook", adminAuth("Ledger Cash:cashbook"), C_cashbook);

router.get(
  "/account_ledger_pdf/:id",
  adminAuth("Ledger:account_ledger_pdf"),
  account_ledger_pdf
);
router.get(
  "/C_account_ledger_pdf/:id",
  adminAuth("Ledger Cash:account_ledger_pdf"),
  C_account_ledger_pdf
);

router.get("/C_passbook", adminAuth("Ledger Cash:passbook"), C_passbook);

module.exports = router;
