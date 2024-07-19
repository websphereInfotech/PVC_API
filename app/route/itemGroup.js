const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_itemGroup,
  update_itemgroup,
    view_itemGroup,
    get_all_itemGroup,
} = require("../controller/itemGroup");

const router = express.Router();

router.post(
  "/create_itemgroup",
  adminAuth("Item Group:create_itemGroup"),
  validation("create_itemGroup"),
    create_itemGroup
);

// router.put(
//   "/update_itemGroup/:id",
//   adminAuth("Item Group:update_itemGroup"),
//   update_itemgroup
// );
router.get(
  "/view_itemGroup/:id",
  adminAuth("Item Group:view_single_itemGroup"),
  view_itemGroup
);
router.get(
  "/get_all_itemgroup",
  adminAuth("Item Group:view_all_itemGroup"),
  get_all_itemGroup
);

module.exports = router;
