const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { view_all_product_stock, view_product_stock, update_product_stock, C_view_all_product_stock, C_view_product_stock, C_update_product_stock } = require("../controller/stock");
const router = express.Router();

/*=============================================================================================================
                                          Without Typc C API
 ============================================================================================================ */

router.get("/view_all_product_stock", adminAuth("Stock:view_all_product_stock"),view_all_product_stock)
router.get("/view_product_stock/:id", adminAuth("Stock:view_product_stock") ,view_product_stock)
router.put("/update_product_stock/:id", adminAuth("Stock:update_product_stock"), validation('update_productStock') ,update_product_stock)


/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

router.get("/C_view_all_product_stock", adminAuth("Stock Cash:view_all_product_cash_stock"),C_view_all_product_stock)
router.get("/C_view_product_stock/:id", adminAuth("Stock Cash:view_product_cash_stock") ,C_view_product_stock)
router.put("/C_update_product_stock/:id", adminAuth("Stock Cash:update_product_cash_stock"), validation('update_productStock') ,C_update_product_stock)


module.exports = router;
