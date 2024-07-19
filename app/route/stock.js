const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { view_all_product_stock, view_product_stock, update_product_stock, view_all_raw_material_stock, view_raw_material_stock, update_raw_material_stock } = require("../controller/stock");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.get("/view_all_product_stock", adminAuth("Stock:view_all_product_stock"),view_all_product_stock)
router.get("/view_product_stock/:id", adminAuth("Stock:view_product_stock") ,view_product_stock)
router.put("/update_product_stock/:id", adminAuth("Stock:update_product_stock"), validation('update_stock') ,update_product_stock)

router.get("/view_all_raw_material_stock", adminAuth("Stock:view_all_raw_material_stock"),view_all_raw_material_stock)
router.get("/view_raw_material_stock/:id", adminAuth("Stock:view_raw_material_stock") ,view_raw_material_stock)
router.put("/update_raw_material_stock/:id", adminAuth("Stock:update_raw_material_stock"), validation('update_stock') ,update_raw_material_stock)

module.exports = router;
