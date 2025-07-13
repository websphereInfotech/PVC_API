const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const { C_update_selfExpense, C_create_selfExpense, C_delete_selfExpense, C_view_selfExpense, C_get_all_selfExpense } = require("../controller/selfExpense");
const { validation } = require("../constant/validate");


const router = express.Router();

router.post(
  "/C_create_selfExpense",
  adminAuth("Self Expense:create_selfExpense"),
  validation("create_selfExpense"),
  C_create_selfExpense
);
router.put(
  "/C_update_selfExpense/:id",
  adminAuth("Self Expense:update_selfExpense"),
  validation("update_selfExpense"),
  C_update_selfExpense
);
router.delete(
  "/C_delete_selfExpense/:id",
  adminAuth("Self Expense:delete_selfExpense"),
  C_delete_selfExpense
);
router.get(
  "/C_view_selfExpense/:id",
  adminAuth("Self Expense:view_selfExpense"),
  C_view_selfExpense
);
router.get(
  "/C_get_all_selfExpense",
  adminAuth("Self Expense:view_all_selfExpense"),
  C_get_all_selfExpense
);

module.exports = router;