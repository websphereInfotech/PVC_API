const {Router} = require("express");
const {create_bom, update_bom, view_all_bom, view_bom, delete_bom} = require("../controller/bom");
const adminAuth = require("../middleware/adminAuth");
const {validation} = require("../constant/validate");

const router = Router();

router.post('/create_bom', adminAuth("Bom:create_bom"), validation('create_bom'), create_bom);
router.put('/update_bom/:bomId', adminAuth("Bom:update_bom"), validation('update_bom'), update_bom);
router.get('/view_all_bom', adminAuth("Bom:view_all_bom"), view_all_bom);
router.get('/view_bom/:bomId', adminAuth("Bom:view_bom"), view_bom);
router.delete('/delete_bom/:bomId', adminAuth("Bom:delete_bom"), delete_bom);


module.exports = router;