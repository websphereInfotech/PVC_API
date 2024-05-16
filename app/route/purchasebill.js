const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purchasebill,
  update_purchasebill,
  delete_purchasebill,
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
router.put(
  "/update_purchasebill/:id",
  adminAuth("Purchase Bill:update_purchasebill"),
  update_purchasebill
);
router.delete(
  "/delete_purchasebill/:id",
  adminAuth("Purchase Bill:delete_purchasebill"),
  delete_purchasebill
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
