const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
    create_itemSubCategory,
    update_itemSubCategory,
    view_itemSubCategory,
    get_all_itemSubCategory_by_category,
    delete_itemSubCategory,
    view_all_itemSubCategory
} = require("../controller/itemSubCategory");

const router = express.Router();

router.post(
  "/create_itemSubCategory",
  adminAuth("Item Sub Category:create_itemSubCategory"),
  validation("create_itemSubCategory"),
    create_itemSubCategory
);
router.put(
  "/update_itemSubCategory/:id",
  adminAuth("Item Sub Category:update_itemSubCategory"),
  update_itemSubCategory
);
router.get(
  "/view_itemSubCategory/:id",
  adminAuth("Item Sub Category:view_single_itemSubCategory"),
  view_itemSubCategory
);
router.get(
  "/get_all_itemSubCategory_by_category/:categoryId",
  adminAuth("Item Sub Category:view_all_itemSubCategory_category"),
    get_all_itemSubCategory_by_category
);

router.delete(
    "/delete_itemSubCategory/:id",
    adminAuth("Item Sub Category:delete_itemSubCategory"),
    delete_itemSubCategory
);

router.get(
    "/view_all_itemSubCategory",
    adminAuth("Item Sub Category:view_all_itemSubCategory"),
    view_all_itemSubCategory
);

module.exports = router;
