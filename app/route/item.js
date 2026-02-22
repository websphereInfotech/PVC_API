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
  get_all_raw_materials,
  get_all_spare_parts,
  get_all_finished_goods,
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
router.get(
    "/get_all_raw_materials",
    adminAuth("Items:view_all_item"),
    get_all_raw_materials
);
router.get(
    "/get_all_spare_parts",
    adminAuth("Items:view_all_item"),
    get_all_spare_parts
);

router.get(
    "/get_all_finished_goods",
    adminAuth("Items:view_all_item"),
    get_all_finished_goods
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
