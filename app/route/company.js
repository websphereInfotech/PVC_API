const express = require("express");
const {
  get_all_company,
  create_company,
  update_company,
  delete_company,
  view_single_company,
  set_default_comapny,
} = require("../controller/company");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post(
  "/create_company",
  adminAuth("Company:create_company"),
  validation("create_company"),
  create_company
);
router.put(
  "/update_company/:id",
  adminAuth("Company:update_company"),
  update_company
);
router.delete(
  "/delete_company/:id",
  adminAuth("Company:delete_company"),
  delete_company
);
router.get(
  "/get_all_company",
  adminAuth("Company:view_all_company"),
  get_all_company
);
router.get(
  "/view_single_company/:id",
  adminAuth("Company:view_single_company"),
  view_single_company
);
router.get(
  "/set_default_comapny/:id",
  adminAuth("Company:set_default_comapny"),
  set_default_comapny
);

module.exports = router;
