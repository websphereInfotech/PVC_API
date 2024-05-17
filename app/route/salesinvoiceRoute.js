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
} = require("../controller/salesinvoice");

const router = express.Router();

/*=============================================================================================================
                                          Without Typc C API
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

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */
router.post('/C_create_salesinvoice',adminAuth("Sales Cash:create_sales_cash"),validation('C_create_salesinvoice'),C_create_salesinvoice);
router.put('/C_update_salesinvoice/:id',adminAuth("Sales Cash:update_sales_cash"),C_update_salesinvoice);
router.delete('/C_delete_salesInvoice/:id',adminAuth("Sales Cash:delete_sales_cash"),C_delete_salesInvoice);
router.get('/C_view_salesInvoice/:id',adminAuth("Sales Cash:view_sales_cash"),C_view_salesInvoice);
router.get('/C_get_all_salesInvoice',adminAuth("Sales Cash:view_all_sales_cash"),C_get_all_salesInvoice);


module.exports = router;
