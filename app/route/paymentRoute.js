const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_payment,
  update_payment,
  delete_payment,
  view_payment,
  get_all_payment,
} = require("../controller/payment");

const router = express.Router();

router.post(
  "/create_payment",
  adminAuth("Payment:create_payment"),
  validation("create_payment"),
  create_payment
);
router.put(
  "/update_payment/:id",
  adminAuth("Payment:update_payment"),
  update_payment
);
router.delete(
  "/delete_payment/:id",
  adminAuth("Payment:delete_payment"),
  delete_payment
);
router.get(
  "/view_payment/:id",
  adminAuth("Payment:view_single_payment"),
  view_payment
);
router.get(
  "/get_all_payment",
  adminAuth("Payment:view_all_payment"),
  get_all_payment
);

module.exports = router;
