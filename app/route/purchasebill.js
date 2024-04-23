const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purchasebill,
  create_purchasebill_item,
  update_purchasebill,
  update_purchasebill_item,
  delete_purchasebill,
  delete_purchasebill_item,
  view_purchasebill,
  get_all_purchasebill,
} = require("../controller/purchaseBill");

const router = express.Router();

router.post(
  "/create_purchasebill",
  adminAuth("Purchase Bill:create_purchasebill"),
  validation("create_purchasebill"),
  create_purchasebill
);
router.post(
  "/create_purchasebill_item",
  adminAuth("Purchase Bill:create_purchasebill_item"),
  validation("create_purchasebill_item"),
  create_purchasebill_item
);
router.put(
  "/update_purchasebill/:id",
  adminAuth("Purchase Bill:update_purchasebill"),
  update_purchasebill
);
router.put(
  "/update_purchasebill_item/:id",
  adminAuth("Purchase Bill:update_purchasebill_item"),
  update_purchasebill_item
);
router.delete(
  "/delete_purchasebill/:id",
  adminAuth("Purchase Bill:delete_purchasebill"),
  delete_purchasebill
);
router.delete(
  "/delete_purchasebill_item/:id",
  adminAuth("Purchase Bill:delete_purchasebill_item"),
  delete_purchasebill_item
);
router.get(
  "/view_purchasebill/:id",
  adminAuth("Purchase Bill:view_single_purchasebill"),
  view_purchasebill
);
router.get(
  "/get_all_purchasebill",
  adminAuth("Purchase Bill:view_all_purchasebill"),
  get_all_purchasebill
);

module.exports = router;
