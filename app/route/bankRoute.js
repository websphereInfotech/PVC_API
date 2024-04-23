const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_bankaccount,
  update_bankaccount,
  delete_bankaccount,
  view_bankaccount,
  get_all_bankaccount,
} = require("../controller/bankAccount");

const router = express.Router();

router.post(
  "/create_bankaccount",
  adminAuth("Bank Account:create_bankaccount"),
  validation("create_bankaccount"),
  create_bankaccount
);
router.put(
  "/update_bankaccount/:id",
  adminAuth("Bank Account:update_bankaccount"),
  update_bankaccount
);
router.delete(
  "/delete_bankaccount/:id",
  adminAuth("Bank Account:delete_bankaccount"),
  delete_bankaccount
);
router.get(
  "/view_bankaccount/:id",
  adminAuth("Bank Account:view_single_bankaccount"),
  view_bankaccount
);
router.get(
  "/get_all_bankaccount",
  adminAuth("Bank Account:view_all_bankaccount"),
  get_all_bankaccount
);

module.exports = router;
