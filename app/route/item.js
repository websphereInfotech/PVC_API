const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_item,
  update_item,
  delete_item,
  view_item,
  get_all_items,
  C_get_all_item,
} = require("../controller/item");

const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post(
  "/create_item",
  adminAuth("Items:create_item"),
  validation("create_item"),
    create_item
);
router.put(
  "/update_item/:id",
  adminAuth("Items:update_item"),
  validation("update_item"),
    update_item
);
router.delete(
  "/delete_item/:id",
  adminAuth("Items:delete_item"),
    delete_item
);
router.get(
  "/view_item/:id",
  adminAuth("Items:view_single_item"),
    view_item
);
router.get(
  "/get_all_items",
  adminAuth("Items:view_all_item"),
    get_all_items
);

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

router.get(
  "/C_get_all_item",
  adminAuth("Items Cash:get_all_item_cash"),
    C_get_all_item
);

module.exports = router;
