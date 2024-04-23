const express = require("express");
const { validation } = require("../views/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_unit,
  update_unit,
  view_unit,
  get_all_unit,
} = require("../controller/units");

const router = express.Router();

router.post(
  "/create_unit",
  adminAuth("Unit:create_unit"),
  validation("create_unit"),
  create_unit
);
router.put("/update_unit/:id", adminAuth("Unit:update_unit"), update_unit);
router.get("/view_unit/:id", adminAuth("Unit:view_single_unit"), view_unit);
router.get("/get_all_unit", adminAuth("Unit:view_all_unit"), get_all_unit);

module.exports = router;
