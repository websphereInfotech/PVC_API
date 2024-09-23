const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
    account_ledger, C_account_ledger, daybook, C_daybook, C_wallet_ledger, C_cashbook, account_ledger_pdf, C_account_ledger_pdf
} = require("../controller/ledger");

const router = express.Router();

router.get(
    "/account_ledger/:id",
    adminAuth("Ledger:account_ledger"),
    account_ledger
);

router.get(
    "/C_account_ledger/:id",
    adminAuth("Ledger Cash:account_ledger"),
    C_account_ledger
);

router.get('/daybook', adminAuth('Ledger:daybook'), daybook)
router.get('/C_daybook', adminAuth('Ledger Cash:daybook'), C_daybook)

router.get('/C_wallet_ledger', adminAuth('Ledger Cash:wallet_ledger'), C_wallet_ledger)
router.get('/C_cashbook', adminAuth('Ledger Cash:cashbook'), C_cashbook)

router.get('/account_ledger_pdf/:id', adminAuth("Ledger:account_ledger_pdf"), account_ledger_pdf);
router.get('/C_account_ledger_pdf/:id', adminAuth("Ledger Cash:account_ledger_pdf"), C_account_ledger_pdf);

module.exports = router;
