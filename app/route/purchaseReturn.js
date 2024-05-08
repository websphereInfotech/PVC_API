const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purchaseReturn,
  create_purchaseReturn_item,
  update_purchaseReturn,
  update_purchaseReturn_item,
  delete_purchasereturn,
  delete_purchaseReturn_item,
  view_purchaseReturn,
  get_all_purchaseReturn,
} = require("../controller/purchaseReturn");

const router = express.Router();

router.post(
  "/create_purchaseReturn",
  adminAuth("Purchase Return:create_purchaseReturn"),
  validation("create_purchaseReturn"),
  create_purchaseReturn
);
router.post(
  "/create_purchaseReturn_item",
  adminAuth("Purchase Return:create_purchaseReturn_item"),
  validation("create_purchaseReturn_item"),
  create_purchaseReturn_item
);
router.put(
  "/update_purchaseReturn/:id",
  adminAuth("Purchase Return:update_purchaseReturn"),
  update_purchaseReturn
);
router.put(
  "/update_purchaseReturn_item/:id",
  adminAuth("Purchase Return:update_purchaseReturn_item"),
  update_purchaseReturn_item
);
router.delete(
  "/delete_purchasereturn/:id",
  adminAuth("Purchase Return:delete_purchasereturn"),
  delete_purchasereturn
);
router.delete(
  "/delete_purchaseReturn_item/:id",
  adminAuth("Purchase Return:delete_purchaseReturn_item"),
  delete_purchaseReturn_item
);
router.get(
  "/view_purchaseReturn/:id",
  adminAuth("Purchase Return:view_single_purchaseReturn"),
  view_purchaseReturn
);
router.get(
  "/get_all_purchaseReturn",
  adminAuth("Purchase Return:view_all_purchaseReturn"),
  get_all_purchaseReturn
);

module.exports = router;
