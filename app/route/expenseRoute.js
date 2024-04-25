const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_expense,
  create_expenseItem,
  update_expense,
  update_expenseItem,
  delete_expense,
  delete_expenseItem,
  get_all_expense,
  view_expense,
} = require("../controller/expense");

const router = express.Router();

router.post(
  "/create_expense",
  adminAuth("Expense:create_expense"),
  validation("create_expense"),
  create_expense
);
router.put(
  "/update_expense/:id",
  adminAuth("Expense:update_expense"),
  update_expense
);
router.delete(
  "/delete_expense/:id",
  adminAuth("Expense:delete_expense"),
  delete_expense
);
router.delete(
  "/delete_expenseItem/:id",
  adminAuth("Expense:delete_expenseItem"),
  delete_expenseItem
);
router.get(
  "/get_all_expense",
  adminAuth("Expense:view_all_expense"),
  get_all_expense
);
router.get(
  "/view_expense/:id",
  adminAuth("Expense:view_single_expense"),
  view_expense
);

module.exports = router;
