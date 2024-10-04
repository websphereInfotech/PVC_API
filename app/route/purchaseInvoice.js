const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purchaseInvoice,
  update_purchaseInvoice,
  delete_purchaseInvoice,
  get_all_purchaseInvoice,
  view_purchaseInvoice,
  C_create_purchaseCash,
  C_update_purchaseCash,
  C_delete_purchaseCash,
  C_get_all_purchaseCash,
  C_view_purchaseCash,
  C_view_purchaseCash_pdf,
  purchaseInvoice_pdf,
  purchaseInvoice_jpg,
  C_view_purchaseCash_jpg,
  purchaseInvoice_excel,
  C_purchaseInvoice_excel,
  C_purchaseinvoice_all_excel
} = require("../controller/purchaseInvoice");

const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */
router.post(
  "/create_purchaseInvoice",
  adminAuth("Purchase Invoice:create_purchase_Invoice"),
  validation("create_purchaseInvoice"),
  create_purchaseInvoice
);
router.put(
  "/update_purchaseInvoice/:id",
  adminAuth("Purchase Invoice:update_purchase_Invoice"),
  validation("update_purchaseInvoice"),
  update_purchaseInvoice
);
router.delete(
  "/delete_purchaseInvoice/:id",
  adminAuth("Purchase Invoice:delete_purchase_Invoice"),
  delete_purchaseInvoice
);
router.get(
  "/view_purchaseInvoice/:id",
  adminAuth("Purchase Invoice:view_single_purchase_Invoice"),
  view_purchaseInvoice
);
router.get(
  "/get_all_purchaseInvoice",
  adminAuth("Purchase Invoice:view_all_purchase_Invoice"),
  get_all_purchaseInvoice
);

router.get(
  "/purchaseInvoice_pdf/:id",
  adminAuth("Purchase Invoice:purchaseInvoice_pdf"),
  purchaseInvoice_pdf
);

router.get(
  "/purchaseInvoice_jpg/:id",
  adminAuth("Purchase Invoice:purchaseInvoice_jpg"),
  purchaseInvoice_jpg
);

router.get(
  "/purchaseInvoice_excel/:id",
  adminAuth("Purchase Invoice:purchaseInvoice_excel"),
  purchaseInvoice_excel
);

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

router.post(
  "/C_create_purchaseCash",
  adminAuth("Purchase Cash:create_purchase_cash"),
  validation("C_create_purchase_Cash"),
  C_create_purchaseCash
);
router.put(
  "/C_update_purchaseCash/:id",
  adminAuth("Purchase Cash:update_purchase_cash"),
  validation("C_update_purchase_Cash"),
  C_update_purchaseCash
);
router.delete(
  "/C_delete_purchaseCash/:id",
  adminAuth("Purchase Cash:delete_purchase_cash"),
  C_delete_purchaseCash
);
router.get(
  "/C_get_all_purchaseCash",
  adminAuth("Purchase Cash:view_all_purchase_cash"),
  C_get_all_purchaseCash
);
router.get(
  "/C_view_purchaseCash/:id",
  adminAuth("Purchase Cash:view_purchase_cash"),
  C_view_purchaseCash
);

router.get(
    "/C_view_purchaseCash_pdf/:id",
    adminAuth("Purchase Cash:view_purchase_cash_pdf"),
    C_view_purchaseCash_pdf
);

router.get(
  "/C_view_purchaseCash_jpg/:id",
  adminAuth("Purchase Cash:view_purchase_cash_jpg"),
  C_view_purchaseCash_jpg
);

router.get(
  "/C_purchaseInvoice_excel/:id",
  adminAuth("Purchase Cash:view_purchase_cash_excel"),
  C_purchaseInvoice_excel
);

router.get(
  "/C_purchaseinvoice_all_excel",
  adminAuth("Purchase Cash:purchase_cash_excel"),
  C_purchaseinvoice_all_excel
);

module.exports = router;
