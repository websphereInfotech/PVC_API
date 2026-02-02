const {Router} = require("express");
const {create_bom, update_bom, view_all_bom, view_bom, delete_bom, settlement_delete_bom} = require("../controller/bom");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");

const router = Router();

router.post('/create_bom', adminAuth("Production:create_production"), validation('create_bom'), create_bom);
router.put('/update_bom/:bomId', adminAuth("Production:update_production"), validation('update_bom'), update_bom);
router.get('/view_all_bom', adminAuth("Production:view_all_production"), view_all_bom);
router.get('/view_bom/:bomId', adminAuth("Production:view_production"), view_bom);
router.delete('/delete_bom/:bomId', adminAuth("Production:delete_production"), delete_bom);
router.delete('/settlement_delete_bom/:bomId', adminAuth("Production:delete_production"), settlement_delete_bom);

module.exports = router;