const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_customer,
  create_customfeild,
  update_customer,
  update_customfeild,
  delete_customer,
  delete_customfeild,
  view_customer,
  get_all_customer,
} = require("../controller/customer");

const router = express.Router();

router.post(
  "/create_customer",
  adminAuth("Customer:create_customer"),
  validation("create_customer"),
  create_customer
);
// router.post(
//   "/create_customfeild",
//   adminAuth("Customer:create_customfeild"),
//   validation("create_customfeild"),
//   create_customfeild
// );
router.put(
  "/update_customer/:id",
  adminAuth("Customer:update_customer"),
  update_customer
);
// router.put(
//   "/update_customfeild/:id",
//   adminAuth("Customer:update_customfeild"),
//   update_customfeild
// );
router.delete(
  "/delete_customer/:id",
  adminAuth("Customer:delete_customer"),
  delete_customer
);
// router.delete(
//   "/delete_customfeild/:id",
//   adminAuth("Customer:delete_customfeild"),
//   delete_customfeild
// );
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

module.exports = router;
