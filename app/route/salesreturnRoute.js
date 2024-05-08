const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_salesReturn,
  get_all_salesReturn,
} = require("../controller/salesReturn");

const router = express.Router();

router.post(
  "/create_salesReturn",
  adminAuth("Sales Return:create_salesReturn"),
  validation("create_salesReturn"),
  create_salesReturn
);
router.get(
  "/get_all_salesReturn",
  adminAuth("Sales Return:view_all_salesReturn"),
  get_all_salesReturn
);

module.exports = router;
