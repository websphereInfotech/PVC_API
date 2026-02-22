const express = require("express");
const {
    create_spare_part, update_spare_part, get_all_spare_part, view_single_spare_part, delete_spare_part
} = require("../controller/sparePart");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

router.post(
    "/create_spare_part",
    adminAuth("SparePart:create_spare_part"),
    validation("spare_part_validation"),
    create_spare_part
);
router.put(
    "/update_spare_part/:id",
    adminAuth("SparePart:update_spare_part"),
    validation("spare_part_validation"),
    update_spare_part
);
router.get(
    "/get_all_spare_part",
    adminAuth("SparePart:view_all_spare_part"),
    get_all_spare_part
);
router.get(
    "/view_single_spare_part/:id",
    adminAuth("SparePart:view_single_spare_part"),
    view_single_spare_part
);
router.delete(
    "/delete_spare_part/:id",
    adminAuth("SparePart:delete_spare_part"),
    delete_spare_part
);


module.exports = router;