const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");

const { create_purchaseOrder, update_purchaseOrder, delete_purchaseOrder, view_purchaseOrder, get_all_purchaseOrder } = require("../controller/purchaseOrder");

const router = express.Router();

router.post(
    "/create_purchaseOrder",
    adminAuth("Purchase Order:create_purchaseOrder"),
    validation("create_purchaseOrder"),
    create_purchaseOrder
);

router.put(
    "/update_purchaseOrder/:id",
    adminAuth("Purchase Order:update_purchaseOrder"),
    validation("update_purchaseOrder"),
    update_purchaseOrder
);

router.delete(
    "/delete_purchaseOrder/:id",
    adminAuth("Purchase Order:delete_purchaseOrder"),
    delete_purchaseOrder
);

router.get(
    "/view_single_purchaseOrder/:id",
    adminAuth("Purchase Order:view_single_purchaseOrder"),
    view_purchaseOrder
);
router.get(
    "/get_all_purchaseOrder",
    adminAuth("Purchase Order:view_all_purchaseOrder"),
    get_all_purchaseOrder
);
module.exports = router;
