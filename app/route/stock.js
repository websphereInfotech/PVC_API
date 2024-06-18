const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { view_product_stock } = require("../controller/stock");

const router = express.Router();

router.get("/view_product_stock/:productId", adminAuth("Stock:view_product_stock") ,view_product_stock)


module.exports = router;
