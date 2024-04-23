const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purchase,
  create_purchaseitem,
  update_purchase,
  update_purchaseitem,
  delete_purchase,
  delete_purchaseitem,
  view_purchase,
  get_all_purchase,
} = require("../controller/purchaseOrder");

const router = express.Router();

router.post(
  "/create_purchase",
  adminAuth("Purchase Order:create_purchase"),
  validation("create_purchase"),
  create_purchase
);
router.post(
  "/create_purchaseitem",
  adminAuth("Purchase Order:create_purchaseitem"),
  validation("create_purchaseitem"),
  create_purchaseitem
);
router.put(
  "/update_purchase/:id",
  adminAuth("Purchase Order:update_purchase"),
  update_purchase
);
router.put(
  "/update_purchaseitem/:itemid",
  adminAuth("Purchase Order:update_purchaseitem"),
  update_purchaseitem
);
router.delete(
  "/delete_purchase/:id",
  adminAuth("Purchase Order:delete_purchase"),
  delete_purchase
);
router.delete(
  "/delete_purchaseitem/:id",
  adminAuth("Purchase Order:delete_purchaseitem"),
  delete_purchaseitem
);
router.get(
  "/view_purchase/:id",
  adminAuth("Purchase Order:view_single_purchase"),
  view_purchase
);
router.get(
  "/get_all_purchase",
  adminAuth("Purchase Order:view_all_purchase"),
  get_all_purchase
);

module.exports = router;
