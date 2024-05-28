const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  C_create_paymentCash,
  C_update_paymentCash,
  C_delete_paymentCash,
  C_view_paymentCash,
  C_get_all_paymentCash,
  create_payment_bank,
  update_payment_bank,
  delete_payment_bank,
  view_payment_bank,
  view_all_payment_bank,
} = require("../controller/paymentCash");

const router = express.Router();

/*=============================================================================================================
                                         Without Typc C API
 ============================================================================================================ */

router.post(
  "/C_create_paymentCash",
  validation("create_paymentCash"),
  adminAuth("Payment Cash:create_payment_Cash"),
  C_create_paymentCash
);
router.put(
  "/C_update_paymentCash/:id",
  adminAuth("Payment Cash:update_payment_Cash"),
  C_update_paymentCash
);
router.delete(
  "/C_delete_paymentCash/:id",
  adminAuth("Payment Cash:delete_payment_Cash"),
  C_delete_paymentCash
);
router.get(
  "/C_view_paymentCash/:id",
  adminAuth("Payment Cash:view_payment_Cash"),
  C_view_paymentCash
);
router.get(
  "/C_get_all_paymentCash",
  adminAuth("Payment Cash:view_all_payment_Cash"),
  C_get_all_paymentCash
);

/*=============================================================================================================
                                         Without Typc C API
 ============================================================================================================ */

router.post(
  "/create_payment_bank",
  adminAuth("Payment Bank:create_payment_bank"),
  create_payment_bank
);
router.put(
  "/update_payment_bank/:id",
  adminAuth("Payment Bank:update_payment_bank"),
  update_payment_bank
);
router.delete(
  "/delete_payment_bank/:id",
  adminAuth("Payment Bank:delete_payment_bank"),
  delete_payment_bank
);
router.get(
  "/view_payment_bank/:id",
  adminAuth("Payment Bank:view_payment_bank"),
  view_payment_bank
);
router.get(
  "/view_all_payment_bank",
  adminAuth("Payment Bank:view_all_payment_bank"),
  view_all_payment_bank
);

module.exports = router;
