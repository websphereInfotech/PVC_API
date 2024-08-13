const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");

const { create_purchaseOrder } = require("../controller/purchaseOrder");

const router = express.Router();

router.post(
    "/create_purchaseOrder",
    adminAuth("Purchase Order:create_purchaseOrder"),
    validation("create_purchaseOrder"),
    create_purchaseOrder
);
module.exports = router;
