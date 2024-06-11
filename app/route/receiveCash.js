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
} = require("../controller/receiveCash");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

router.post(
  "/C_create_receiveCash",
  adminAuth("Receive Cash:create_receive_Cash"),
  validation("create_receiveCash"),
  C_create_receiveCash
);
router.get(
  "/C_get_all_receiveCash",
  adminAuth("Receive Cash:view_all_receive_Cash"),
  C_get_all_receiveCash
);
router.get(
  "/C_view_receiveCash/:id",
  adminAuth("Receive Cash:view_receive_Cash"),
  C_view_receiveCash
);
router.put(
  "/C_update_receiveCash/:id",
  adminAuth("Receive Cash:update_receive_Cash"),
  validation("update_receiveCash"),
  C_update_receiveCash
);
router.delete(
  "/C_delete_receiveCash/:id",
  adminAuth("Receive Cash:delete_receive_Cash"),
  C_delete_receiveCash
);

/*=============================================================================================================
                                         Without Typc C API
 ============================================================================================================ */

router.post(
  "/create_receive_bank",
  adminAuth("Receive Bank:create_receive_bank"),
  validation('create_receive_bank'),
  create_receive_bank
);
router.put(
  "/update_receive_bank/:id",
  adminAuth("Receive Bank:update_receive_bank"),
  validation("update_receive_bank"),
  update_receive_bank
);
router.delete(
  "/delete_receive_bank/:id",
  adminAuth("Receive Bank:delete_receive_bank"),
  delete_receive_bank
);
router.get(
  "/view_receive_bank/:id",
  adminAuth("Receive Bank:view_receive_bank"),
  view_receive_bank
);
router.get(
  "/get_all_receive_bank",
  adminAuth("Receive Bank:get_all_receive_bank"),
  get_all_receive_bank
);

module.exports = router;
