const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_purchasebill,
  update_purchasebill,
  delete_purchasebill,
  view_purchasebill,
  get_all_purchasebill,
  C_create_purchasebill,
  C_delete_purchasebill,
  C_get_all_purchasebill,
  C_view_purchasebill,
} = require("../controller/purchaseBill");

const router = express.Router();

/*=============================================================================================================
                                          Without Typc C API
 ============================================================================================================ */
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

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

 router.post('/C_create_purchasebill',adminAuth("Purchase Cash:create_purchase_cash"),validation('C_create_salesinvoice'),C_create_purchasebill);
 router.put('/C_update_purchasebill/:id',adminAuth("Purchase Cash:update_purchase_cash"),update_purchasebill);
 router.delete('/C_delete_purchasebill/:id',adminAuth("Purchase Cash:delete_purchase_cash"),C_delete_purchasebill);
 router.get('/C_get_all_purchasebill',adminAuth("Purchase Cash:view_all_purchase_cash"),C_get_all_purchasebill);
 router.get('/C_view_purchasebill/:id',adminAuth("Purchase Cash:view_purchase_cash"),C_view_purchasebill);

module.exports = router;
