const express = require("express");
const {
  create_claim,
  update_claim,
  delete_claim,
  view_myclaim,
  view_reciveclaim,
  isapproved_claim,
  view_single_claim,
  view_claim_ledger,
  view_claimBalance_ledger,
  get_all_ClaimUser,
} = require("../controller/claim");
const adminToken = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");

const router = express.Router();

router.post(
  "/create_claim",
  adminToken("Claim Cash:create_claim"),
  validation("create_claim"),
  create_claim
);
router.put(
  "/update_claim/:id",
  adminToken("Claim Cash:update_claim"),
  update_claim
);
router.delete(
  "/delete_claim/:id",
  adminToken("Claim Cash:delete_claim"),
  delete_claim
);
router.get(
  "/view_myclaim",
  adminToken("Claim Cash:view_myclaim"),
  view_myclaim
);
router.get(
  "/view_reciveclaim",
  adminToken("Claim Cash:view_reciveclaim"),
  view_reciveclaim
);
router.post(
  "/isapproved_claim/:id",
  adminToken("Claim Cash:isapproved_claim"),
  isapproved_claim
);

router.get(
  "/view_single_claim/:id",
  adminToken("Claim Cash:view_single_claim"),
  view_single_claim
);

router.get(
  "/view_claim_ledger",
  adminToken("Claim Cash:view_claim_ledger"),
  view_claim_ledger
);

router.get(
  "/view_claimBalance_ledger",
  adminToken("Claim Cash:view_claimBalance_ledger"),
  view_claimBalance_ledger
);
router.get(
  "/get_all_ClaimUser",
  adminToken("Claim Cash:view_all_ClaimUser"),
  get_all_ClaimUser
);
module.exports = router;
