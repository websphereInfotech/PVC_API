const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { view_all_item_stock, view_item_stock, update_item_stock } = require("../controller/stock");
const router = express.Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.get("/view_all_item_stock/:groupId", adminAuth("Stock:view_all_item_stock"),view_all_item_stock)
router.get("/view_item_stock/:id", adminAuth("Stock:view_item_stock") ,view_item_stock)
router.put("/update_item_stock/:id", adminAuth("Stock:update_item_stock"), validation('update_stock') ,update_item_stock)

module.exports = router;
