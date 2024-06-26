const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_product,
  update_product,
  delete_product,
  view_product,
  get_all_product,
} = require("../controller/product");

const router = express.Router();

router.post(
  "/create_product",
  adminAuth("Product:create_product"),
  validation("create_product"),
  create_product
);
router.put(
  "/update_product/:id",
  adminAuth("Product:update_product"),
  update_product
);
router.delete(
  "/delete_product/:id",
  adminAuth("Product:delete_product"),
  delete_product
);
router.get(
  "/view_product/:id",
  adminAuth("Product:view_single_product"),
  view_product
);
router.get(
  "/get_all_product",
  adminAuth("Product:view_all_product"),
  get_all_product
);

module.exports = router;
