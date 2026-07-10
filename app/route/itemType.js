const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_itemType,
  update_itemType,
  view_itemType,
  get_all_itemType,
  delete_itemType,
} = require("../controller/itemType");

const router = express.Router();

router.post(
  "/create_itemType",
  adminAuth("Item Type:create_itemType"),
  validation("create_itemType"),
  create_itemType
);

router.put(
  "/update_itemType/:id",
  adminAuth("Item Type:update_itemType"),
  validation("create_itemType"),
  update_itemType
);

router.get(
  "/view_itemType/:id",
  adminAuth("Item Type:view_single_itemType"),
  view_itemType
);

router.get(
  "/get_all_itemType",
  adminAuth("Item Type:view_all_itemType"),
  get_all_itemType
);

router.get(
  "/view_all_itemType",
  adminAuth("Item Type:view_all_itemType"),
  get_all_itemType
);

router.delete(
  "/delete_itemType/:id",
  adminAuth("Item Type:delete_itemType"),
  delete_itemType
);

module.exports = router;
