const express = require("express");
const {
  create_creditNote,
  update_creditNote,
  get_all_creditNote,
  delete_creditNote,
  view_single_creditNote,
  C_create_creditNote,
  C_update_creditNote,
  C_get_all_creditNote,
  C_delete_creditNote,
  C_view_single_creditNote,
  creditNote_pdf,
  C_creditNote_pdf,
  creditNote_jpg,
  C_creditNote_jpg,
  C_creditNote_single_excel,
  creditNote_single_excel,
  C_creditNote_excel,
  creditNote_excel
} = require("../controller/creditNote");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");
const router = express.Router();

router.post(
  "/create_creditNote",
  adminAuth("Credit Note:create_creditNote"),
  validation("create_creditNote"),
  create_creditNote
);
router.put(
  "/update_creditNote/:id",
  adminAuth("Credit Note:update_creditNote"),
  validation("update_creditNote"),
  update_creditNote
);
router.get(
  "/get_all_creditNote",
  adminAuth("Credit Note:view_all_creditNote"),
  get_all_creditNote
);
router.get(
  "/view_single_creditNote/:id",
  adminAuth("Credit Note:view_single_creditNote"),
  view_single_creditNote
);
router.delete(
  "/delete_creditNote/:id",
  adminAuth("Credit Note:delete_creditNote"),
  delete_creditNote
);

router.get(
  "/creditNote_pdf/:id",
  adminAuth("Credit Note:creditNote_pdf"),
  creditNote_pdf
);

router.get(
  "/creditNote_jpg/:id",
  adminAuth("Credit Note:creditNote_jpg"),
  creditNote_jpg
);

router.get(
  "/creditNote_single_excel/:id",
  adminAuth("Credit Note:creditNote_single_excel"),
  creditNote_single_excel
);

router.get(
  "/creditNote_excel",
  adminAuth("Credit Note:creditNote_excel"),
  creditNote_excel
);

/*=============================================================================================================
                                         With Type C API
 ============================================================================================================ */

router.post(
  "/C_create_creditNote",
  adminAuth("Credit Note Cash:create_creditNote"),
  validation("C_create_creditNote"),
  C_create_creditNote
);
router.put(
  "/C_update_creditNote/:id",
  adminAuth("Credit Note Cash:update_creditNote"),
  validation("C_create_creditNote"),
  C_update_creditNote
);
router.get(
  "/C_get_all_creditNote",
  adminAuth("Credit Note Cash:view_all_creditNote"),
  C_get_all_creditNote
);
router.get(
  "/C_view_single_creditNote/:id",
  adminAuth("Credit Note Cash:view_single_creditNote"),
  C_view_single_creditNote
);
router.delete(
  "/C_delete_creditNote/:id",
  adminAuth("Credit Note Cash:delete_creditNote"),
  C_delete_creditNote
);

router.get(
  "/C_creditNote_pdf/:id",
  adminAuth("Credit Note Cash:creditNote_pdf"),
  C_creditNote_pdf
);

router.get(
  "/C_creditNote_jpg/:id",
  adminAuth("Credit Note Cash:creditNote_jpg"),
  C_creditNote_jpg
);

router.get(
  "/C_creditNote_single_excel/:id",
  adminAuth("Credit Note Cash:creditNote_single_excel"),
  C_creditNote_single_excel
);

router.get(
  "/C_creditNote_excel",
  adminAuth("Credit Note Cash:creditNote_excel"),
  C_creditNote_excel
);

module.exports = router;
