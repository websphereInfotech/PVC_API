const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  C_create_orderprocessing,
  C_update_orderprocessing,
  C_delete_orderprocessing,
  C_view_orderprocessing,
  C_get_all_orderprocessing,
  C_Update_Status_orderprocessing,
  get_all_items_orderprocessing,
} = require("../controller/OrderProcessing");

const router = express.Router();

router.post(
  "/create_order_processing",
  adminAuth("Order Processing:create_order_processing"),
  //   validation("C_OrderProcessing"),
  C_create_orderprocessing
);
router.put(
  "/update_order_processing/:id",
  adminAuth("Order Processing:update_order_processing"),
  //   validation("C_update_salesinvoice"),
  C_update_orderprocessing
);
router.delete(
  "/delete_order_processing/:id",
  adminAuth("Order Processing:delete_order_processing"),
  C_delete_orderprocessing
);
router.get(
  "/view_order_processing/:id",
  adminAuth("Order Processing:view_order_processing"),
  C_view_orderprocessing
);
router.get(
  "/get_all_order_processing",
  adminAuth("Order Processing:view_all_order_processing"),
  C_get_all_orderprocessing
);
router.put(
  "/update_status_order_processing/:id",
  adminAuth("Order Processing:update_order_processing"),
  C_Update_Status_orderprocessing
);
router.get(
  "/get_all_order_items",
  adminAuth("Order Processing:create_order_processing"),
  get_all_items_orderprocessing
);
module.exports = router;
