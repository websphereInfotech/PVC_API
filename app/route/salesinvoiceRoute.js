const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_salesInvoice,
  update_salesInvoice,
  delete_salesInvoice,
  view_salesInvoice,
  get_all_salesInvoice,
  C_create_salesinvoice,
  C_update_salesinvoice,
  C_delete_salesInvoice,
  C_view_salesInvoice,
  C_get_all_salesInvoice,
  C_view_salesInvoice_pdf,
  salesInvoice_pdf,
  salesInvoice_excel,
  view_salesInvoice_excel,
  view_salesInvoice_jpg,
  C_view_salesInvoice_jpg,
  C_view_salesInvoice_excel,
  C_salesInvoice_excel,
  salesInvoice_html,
  C_salesInvoice_html
} = require("../controller/salesinvoice");

const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post(
  "/create_salesinvoice",
  adminAuth("Sales Invoice:create_salesinvoice"),
  validation("create_salesinvoice"),
  create_salesInvoice
);

router.put(
  "/update_salesInvoice/:id",
  adminAuth("Sales Invoice:update_salesInvoice"),
  validation("update_salesinvoice"),
  update_salesInvoice
);
router.delete(
  "/delete_salesInvoice/:id",
  adminAuth("Sales Invoice:delete_salesInvoice"),
  delete_salesInvoice
);
router.get(
  "/view_salesInvoice/:id",
  adminAuth("Sales Invoice:view_single_salesInvoice"),
  view_salesInvoice
);
router.get(
  "/get_all_salesInvoice",
  adminAuth("Sales Invoice:view_all_salesInvoice"),
  get_all_salesInvoice
);

router.get(
  "/salesInvoice_pdf/:id",
  adminAuth("Sales Invoice:salesInvoice_pdf"),
  salesInvoice_pdf
);

router.get(
  "/salesInvoice_excel",
  adminAuth("Sales Invoice:salesInvoice_excel"),
  salesInvoice_excel
);

router.get(
  "/view_salesInvoice_excel/:id",
  adminAuth("Sales Invoice:view_salesInvoice_excel"),
  view_salesInvoice_excel
);

router.get(
  "/view_salesInvoice_jpg/:id",
  adminAuth("Sales Invoice:view_salesInvoice_jpg"),
  view_salesInvoice_jpg
);

router.get(
  "/salesInvoice_html/:id",
  adminAuth("Sales Invoice:salesInvoice_html"),
  salesInvoice_html
);

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */
router.post(
  "/C_create_salesinvoice",
  adminAuth("Sales Cash:create_sales_cash"),
  validation("C_create_salesinvoice"),
  C_create_salesinvoice
);
router.put(
  "/C_update_salesinvoice/:id",
  adminAuth("Sales Cash:update_sales_cash"),
  validation("C_update_salesinvoice"),
  C_update_salesinvoice
);
router.delete(
  "/C_delete_salesInvoice/:id",
  adminAuth("Sales Cash:delete_sales_cash"),
  C_delete_salesInvoice
);
router.get(
  "/C_view_salesInvoice/:id",
  adminAuth("Sales Cash:view_sales_cash"),
  C_view_salesInvoice
);
router.get(
  "/C_get_all_salesInvoice",
  adminAuth("Sales Cash:view_all_sales_cash"),
  C_get_all_salesInvoice
);

router.get(
  "/C_view_salesInvoice_pdf/:id",
  adminAuth("Sales Cash:view_sales_cash_pdf"),
  C_view_salesInvoice_pdf
);

router.get(
  "/C_view_salesInvoice_jpg/:id",
  adminAuth("Sales Cash:view_sales_cash_jpg"),
  C_view_salesInvoice_jpg
);

router.get(
  "/C_view_salesInvoice_excel/:id",
  adminAuth("Sales Cash:view_sales_cash_excel"),
  C_view_salesInvoice_excel
);

router.get(
  "/C_salesInvoice_html/:id",
  adminAuth("Sales Cash:sales_cash_html"),
  C_salesInvoice_html
);

router.get(
  "/C_salesInvoice_excel",
  adminAuth("Sales Cash:sales_cash_excel"),
  C_salesInvoice_excel
);
module.exports = router;
