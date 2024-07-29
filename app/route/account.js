const {Router} = require("express");
const {view_all_account_group, create_account, view_one_account, update_account, view_all_account, delete_account, C_view_all_account} = require("../controller/account");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");

const router = Router();

router.get("/view_all_account_group",adminAuth("Account:view_all_account_group"), view_all_account_group);
router.post("/create_account",adminAuth("Account:create_account"), validation('account_validation'), create_account);
router.get("/view_one_account/:accountId",adminAuth("Account:view_one_account"), view_one_account);
router.put("/update_account/:accountId",adminAuth("Account:update_account"), validation('account_validation'), update_account);
router.get("/view_all_account",adminAuth("Account:view_all_account"), view_all_account);
router.delete("/delete_account/:accountId",adminAuth("Account:delete_account"), delete_account);

router.get("/C_view_all_account",adminAuth("Account Cash:view_all_account"), C_view_all_account);
module.exports = router;