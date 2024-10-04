const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {
  create_debitNote,
  update_debitNote,
  get_all_debitNote,
  view_single_debitNote,
  delete_debitNote,
  C_create_debitNote,
  C_update_debitNote,
  C_get_all_debitNote,
  C_view_single_debitNote,
  C_delete_debitNote,
  C_debitNote_pdf,
  debitNote_pdf,
  debitNote_jpg,
  C_debitNote_jpg,
  debitNote_single_excel,
  C_debitNote_single_excel,C_debitNote_excel
} = require("../controller/debitNote");


const router = express.Router();

router.post(
  "/create_debitNote",
  adminAuth("Debit Note:create_debitNote"),
  validation("create_debitNote"),
  create_debitNote
);
router.put(
  "/update_debitNote/:id",
  adminAuth("Debit Note:update_debitNote"),
  validation("update_debitNote"),
  update_debitNote
);
router.get(
  "/get_all_debitNote",
  adminAuth("Debit Note:view_all_debitNote"),
  get_all_debitNote
);
router.get(
  "/view_single_debitNote/:id",
  adminAuth("Debit Note:view_single_debitNote"),
  view_single_debitNote
);
router.delete(
  "/delete_debitNote/:id",
  adminAuth("Debit Note:delete_debitNote"),
  delete_debitNote
);

router.get(
  "/debitNote_pdf/:id",
  adminAuth("Debit Note:debitNote_pdf"),
  debitNote_pdf
);

router.get(
  "/debitNote_jpg/:id",
  adminAuth("Debit Note:debitNote_jpg"),
  debitNote_jpg
);

router.get(
  "/debitNote_single_excel/:id",
  adminAuth("Debit Note:debitNote_single_excel"),
  debitNote_single_excel
);

/*=============================================================================================================
                                         With Type C API
 ============================================================================================================ */

router.post(
  "/C_create_debitNote",
  adminAuth("Debit Note Cash:create_debitNote"),
  validation("C_create_debitNote"),
  C_create_debitNote
);
router.put(
  "/C_update_debitNote/:id",
  adminAuth("Debit Note Cash:update_debitNote"),
  validation("C_create_debitNote"),
  C_update_debitNote
);
router.get(
  "/C_get_all_debitNote",
  adminAuth("Debit Note Cash:view_all_debitNote"),
  C_get_all_debitNote
);
router.get(
  "/C_view_single_debitNote/:id",
  adminAuth("Debit Note Cash:view_single_debitNote"),
  C_view_single_debitNote
);
router.delete(
  "/C_delete_debitNote/:id",
  adminAuth("Debit Note Cash:delete_debitNote"),
  C_delete_debitNote
);

router.get(
  "/C_debitNote_pdf/:id",
  adminAuth("Debit Note Cash:debitNote_pdf"),
  C_debitNote_pdf
);

router.get(
  "/C_debitNote_jpg/:id",
  adminAuth("Debit Note Cash:debitNote_jpg"),
  C_debitNote_jpg
);

router.get(
  "/C_debitNote_single_excel/:id",
  adminAuth("Debit Note Cash:debitNote_single_excel"),
  C_debitNote_single_excel
);

router.get(
  "/C_debitNote_excel",
  adminAuth("Debit Note Cash:debitNote_excel"),
  C_debitNote_excel
);

module.exports = router;
