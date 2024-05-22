const express = require("express");
const {
  create_claim,
  update_claim,
  delete_claim,
  view_myclaim,
  view_reciveclaim,
  isapproved_claim,
} = require("../controller/claim");
const adminToken = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");

const router = express.Router();

router.post(
  "/create_claim",
  adminToken("Claim:create_claim"),
  validation("create_claim"),
  create_claim
);
router.put("/update_claim/:id", adminToken("Claim:update_claim"), update_claim);
router.delete(
  "/delete_claim/:id",
  adminToken("Claim:delete_claim"),
  delete_claim
);
router.get("/view_myclaim", adminToken("Claim:view_myclaim"), view_myclaim);
router.get(
  "/view_reciveclaim",
  adminToken("Claim:view_reciveclaim"),
  view_reciveclaim
);
router.post(
  "/isapproved_claim/:id",
  adminToken("Claim:isapproved_claim"),
  isapproved_claim
);

module.exports = router;
