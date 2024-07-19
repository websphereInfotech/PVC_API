const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
    create_itemCategory,
  update_itemcategory,
    view_itemCategory,
    get_all_itemCategoryGroup,
} = require("../controller/itemCategory");

const router = express.Router();

router.post(
  "/create_itemCategory",
  adminAuth("Item Category:create_itemCategory"),
  validation("create_itemCategory"),
    create_itemCategory
);
// router.put(
//   "/update_itemcategory/:id",
//   adminAuth("Item Category:update_itemcategory"),
//   update_itemcategory
// );
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

module.exports = router;
