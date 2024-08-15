const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
    create_itemCategory,
    update_itemCategory,
    view_itemCategory,
    get_all_itemCategoryGroup,
    delete_itemCategory,
    view_all_itemCategory
} = require("../controller/itemCategory");

const router = express.Router();

router.post(
  "/create_itemCategory",
  adminAuth("Item Category:create_itemCategory"),
  validation("create_itemCategory"),
    create_itemCategory
);
router.put(
  "/update_itemCategory/:id",
  adminAuth("Item Category:update_itemCategory"),
  update_itemCategory
);
router.get(
  "/view_itemCategory/:id",
  adminAuth("Item Category:view_single_itemCategory"),
  view_itemCategory
);
router.get(
  "/get_all_itemCategoryGroup/:groupId",
  adminAuth("Item Category:view_all_itemCategory_group"),
    get_all_itemCategoryGroup
);

router.delete(
    "/delete_itemCategory/:id",
    adminAuth("Item Category:delete_itemCategory"),
    delete_itemCategory
);

router.get(
    "/view_all_itemCategory",
    adminAuth("Item Category:view_all_itemCategory"),
    view_all_itemCategory
);

module.exports = router;
