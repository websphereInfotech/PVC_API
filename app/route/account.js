const {Router} = require("express");
const {view_all_account_group, create_account, view_one_account} = require("../controller/account");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");

const router = Router();

router.get("/view_all_account_group",adminAuth("Account:view_all_account_group"), view_all_account_group);
router.post("/create_account",adminAuth("Account:create_account"), validation('create_account'), create_account);
router.get("/view_one_account/:accountId",adminAuth("Account:view_one_account"), view_one_account);

module.exports = router;