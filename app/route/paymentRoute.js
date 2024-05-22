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
const { C_create_paymentCash, C_update_paymentCash, C_delete_paymentCash, C_view_paymentCash, C_get_all_paymentCash } = require("../controller/paymentCash");

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

router.post('/C_create_paymentCash',validation('create_paymentCash'),adminAuth('Payment Cash:create_payment_Cash'),C_create_paymentCash);
router.put('/C_update_paymentCash/:id',adminAuth('Payment Cash:update_payment_Cash'),C_update_paymentCash);
router.delete('/C_delete_paymentCash/:id',adminAuth('Payment Cash:delete_payment_Cash'),C_delete_paymentCash);
router.get('/C_view_paymentCash/:id',adminAuth('Payment Cash:view_payment_Cash'),C_view_paymentCash);
router.get('/C_get_all_paymentCash',adminAuth('Payment Cash:view_all_payment_Cash'),C_get_all_paymentCash);
module.exports = router;
