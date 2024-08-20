const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
    account_ledger, C_account_ledger, daybook, C_daybook, C_wallet_ledger
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

router.get('/C_wallet_ledger/:userId', adminAuth('Login:wallet_ledger'), C_wallet_ledger)

module.exports = router;
