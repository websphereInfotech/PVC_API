const express = require("express");
const {
  create_user,
  get_all_user,
  delete_user,
  update_user,
  user_login,
  reset_password,
  view_user,
  user_logout,
  check_user,
  add_user,
  view_all_userTOComapny,
  remove_company,
  add_user_bank_account,
  edit_user_bank_account,
  delete_user_bank_account,
  view_user_bank_account,
  view_all_user_bank_account,
  wallet_approve,
  get_all_company_user
} = require("../controller/user");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const adminToken = require("../middleware/adminAuth");
const {view_user_balance} = require("../controller/claim");
const router = express.Router();

router.post(
  "/create_user",
  adminAuth("Login:create_user"),
  validation("create_user"),
  create_user
);
router.get("/get_all_user", adminAuth("Login:view_all_user"), get_all_user);
router.get("/get_all_company_user", adminAuth("Login:view_all_user"), get_all_company_user);

router.get("/view_user/:id", adminAuth("Login:view_user"), view_user);

router.delete(
  "/delete_user/:id",
  adminAuth("Login:delete_user"),
  delete_user
);
router.put(
  "/update_user/:id",
  adminAuth("Login:update_user"),
  validation("update_user"),
  update_user
);
router.post("/user_login", validation("userLogin"), user_login);
router.post(
  "/reset_password/:id",
  adminAuth("Login:reset_password"),
  reset_password
);
router.post("/user_logout", adminAuth("Login:user_logout"), user_logout);
router.post("/check_user", adminAuth("Login:check_user"),validation("check_user"), check_user);
router.get("/add_user/:id", adminAuth("Login:add_user"), add_user);
router.get(
  "/view_all_userTOComapny",
  adminAuth("Login:view_all_JoinComapny"),
  view_all_userTOComapny
);
router.delete('/remove_company/:id', adminAuth("Login:remove_company"), remove_company)

router.get('/view_user_balance',adminToken("Claim Cash:view_user_balance"),view_user_balance);
router.post('/add_user_bank_account',adminToken("Login:add_user_bank_account"), validation('add_user_bank_account'),add_user_bank_account);
router.put('/edit_user_bank_account/:accountId',adminToken("Login:edit_user_bank_account"), validation('add_user_bank_account'),edit_user_bank_account);
router.delete('/delete_user_bank_account/:accountId',adminToken("Login:delete_user_bank_account"),delete_user_bank_account);
router.get('/view_user_bank_account/:accountId',adminToken("Login:view_user_bank_account"),view_user_bank_account);
router.get('/view_all_user_bank_account/:userId',adminToken("Login:view_all_user_bank_account"),view_all_user_bank_account);

router.get('/wallet_approve/:id',adminToken("Login:wallet_approve"),wallet_approve);

module.exports = router;
