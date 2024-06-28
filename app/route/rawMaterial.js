const {Router} = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const {create_raw_material, update_raw_material, delete_raw_material, view_single_raw_material, view_all_raw_material, C_get_all_raw_material_cash} = require("../controller/rawMaterial");

const router = new Router();

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

router.post(
    "/create_raw_material",
    adminAuth("Raw Material:create_raw_material"),
    validation("create_raw_material"),
    create_raw_material
);

router.put(
    "/update_raw_material/:id",
    adminAuth("Raw Material:update_raw_material"),
    validation("update_raw_material"),
    update_raw_material
);
router.delete(
    "/delete_raw_material/:id",
    adminAuth("Raw Material:delete_raw_material"),
    delete_raw_material
);
router.get(
    "/view_single_raw_material/:id",
    adminAuth("Raw Material:view_single_raw_material"),
    view_single_raw_material
);
router.get(
    "/view_all_raw_material",
    adminAuth("Raw Material:view_all_raw_material"),
    view_all_raw_material
);

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

router.get(
    "/C_get_all_raw_material_cash",
    adminAuth("Raw Material Cash:get_all_raw_material_cash"),
    C_get_all_raw_material_cash
);

module.exports = router;