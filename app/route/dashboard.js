const { Router } = require('express');
const {totalSales} = require("../controller/dashboard");
const adminAuth = require("../middleware/adminAuth");
const router = Router();

router.get('/total_sales', adminAuth('Dashboard:total_sales'), totalSales)

module.exports = router;