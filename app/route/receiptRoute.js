const express = require("express");
const {
  C_create_receiveCash,
  C_get_all_receiveCash,
  C_view_receiveCash,
  C_update_receiveCash,
  C_delete_receiveCash,
  create_receive_bank,
  update_receive_bank,
  delete_receive_bank,
  view_receive_bank,
  get_all_receive_bank,
} = require("../controller/receipt");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

router.post(
  "/C_create_receiveCash",
  adminAuth("Receipt Cash:create_receipt"),
  validation("create_receiveCash"),
  C_create_receiveCash
);
router.get(
  "/C_get_all_receiveCash",
  adminAuth("Receipt Cash:view_all_receipt"),
  C_get_all_receiveCash
);
router.get(
  "/C_view_receiveCash/:id",
  adminAuth("Receipt Cash:view_receipt"),
  C_view_receiveCash
);
router.put(
  "/C_update_receiveCash/:id",
  adminAuth("Receipt Cash:update_receipt"),
  validation("update_receiveCash"),
  C_update_receiveCash
);
router.delete(
  "/C_delete_receiveCash/:id",
  adminAuth("Receipt Cash:delete_receipt"),
  C_delete_receiveCash
);

/*=============================================================================================================
                                         Without Type C API
 ============================================================================================================ */

router.post(
  "/create_receive_bank",
  adminAuth("Receipt:create_receipt"),
  validation('create_receive_bank'),
  create_receive_bank
);
router.put(
  "/update_receive_bank/:id",
  adminAuth("Receipt:update_receipt"),
  validation("update_receive_bank"),
  update_receive_bank
);
router.delete(
  "/delete_receive_bank/:id",
  adminAuth("Receipt:delete_receipt"),
  delete_receive_bank
);
router.get(
  "/view_receive_bank/:id",
  adminAuth("Receipt:view_receipt"),
  view_receive_bank
);
router.get(
  "/get_all_receive_bank",
  adminAuth("Receipt:get_all_receipt"),
  get_all_receive_bank
);

module.exports = router;
