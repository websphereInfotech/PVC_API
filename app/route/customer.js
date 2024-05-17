const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_customer,
  update_customer,
  delete_customer,
  view_customer,
  get_all_customer,
  C_get_all_customer,
} = require("../controller/customer");

const router = express.Router();

/*=============================================================================================================
                                          Widhout Typc C API
 ============================================================================================================ */

router.post(
  "/create_customer",
  adminAuth("Customer:create_customer"),
  validation("create_customer"),
  create_customer
);
router.put(
  "/update_customer/:id",
  adminAuth("Customer:update_customer"),
  validation('update_customer'),
  update_customer
);
router.delete(
  "/delete_customer/:id",
  adminAuth("Customer:delete_customer"),
  delete_customer
);
router.get(
  "/view_customer/:id",
  adminAuth("Customer:view_single_customer"),
  view_customer
);
router.get(
  "/get_all_customer",
  adminAuth("Customer:view_all_customer"),
  get_all_customer
);

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

router.get('/C_get_all_customer',adminAuth('Customer Cash:get_all_customer_cash'),C_get_all_customer);

module.exports = router;
