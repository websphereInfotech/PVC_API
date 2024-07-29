const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
    normal_ledger
} = require("../controller/ledger");

const router = express.Router();

router.get(
    "/normal/:id",
    adminAuth("Item Group:create_itemGroup"),
    normal_ledger
);

module.exports = router;
