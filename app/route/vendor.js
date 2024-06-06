const express = require("express");
const {
  create_vendor,
  update_vendor,
  delete_vandor,
  get_all_vandor,
  view_vendor,
  C_get_all_vandor,
} = require("../controller/vendor");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");

const router = express.Router();

/*=============================================================================================================
                                          Widhout Typc C API
 ============================================================================================================ */

router.post(
  "/create_vendor",
  adminAuth("Vendor:create_vendor"),
  validation("create_vendor"),
  create_vendor
);
router.put(
  "/update_vendor/:id",
  adminAuth("Vendor:update_vendor"),
  validation("update_vendor"),
  update_vendor
);
router.delete(
  "/delete_vandor/:id",
  adminAuth("Vendor:delete_vandor"),
  delete_vandor
);
router.get(
  "/get_all_vandor",
  adminAuth("Vendor:view_all_vandor"),
  get_all_vandor
);

router.get("/view_vendor/:id", adminAuth("Vendor:view_vendor"), view_vendor);

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

router.get(
  "/C_get_all_vandor",
  adminAuth("Vendor Cash:get_all_vandor_cash"),
  C_get_all_vandor
);

module.exports = router;
