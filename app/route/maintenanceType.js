const express = require("express");
const {
    create_maintenanceType, update_maintenanceType,view_single_maintenanceType, delete_maintenanceType, get_all_maintenanceType
} = require("../controller/maintenanceType");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

router.post(
    "/create_maintenanceType",
    adminAuth("Maintenance Type:create_maintenanceType"),
    validation("maintenanceType_validation"),
    create_maintenanceType
);
router.put(
    "/update_maintenanceType/:id",
    adminAuth("Maintenance Type:update_maintenanceType"),
    validation("maintenanceType_validation"),
    update_maintenanceType
);
router.get(
    "/get_all_maintenanceType",
    adminAuth("Maintenance Type:view_all_maintenanceType"),
    get_all_maintenanceType
);
router.get(
    "/view_single_maintenanceType/:id",
    adminAuth("Maintenance Type:view_single_maintenanceType"),
    view_single_maintenanceType
);
router.delete(
    "/delete_maintenanceType/:id",
    adminAuth("Maintenance Type:delete_maintenanceType"),
    delete_maintenanceType
);

module.exports = router;