const express = require("express");
const {
    create_wastage, update_wastage, get_all_wastage, view_single_wastage, delete_wastage
} = require("../controller/wastage");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

router.post(
    "/create_wastage",
    adminAuth("Wastage:create_wastage"),
    validation("wastage_validation"),
    create_wastage
);
router.put(
    "/update_wastage/:id",
    adminAuth("Wastage:update_wastage"),
    validation("wastage_validation"),
    update_wastage
);
router.get(
    "/get_all_wastage",
    adminAuth("Wastage:view_all_wastage"),
    get_all_wastage
);
router.get(
    "/view_single_wastage/:id",
    adminAuth("Wastage:view_single_wastage"),
    view_single_wastage
);
router.delete(
    "/delete_wastage/:id",
    adminAuth("Wastage:delete_wastage"),
    delete_wastage
);


module.exports = router;