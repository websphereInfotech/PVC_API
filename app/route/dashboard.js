const { Router } = require('express');
const {totalSales, totalPurchase, totalReceivedAmount, totalCashReceivedAmount, totalPaymentAmount, totalCashPaymentAmount, totalCashSales, totalCashPurchase} = require("../controller/dashboard");
const adminAuth = require("../middleware/adminAuth");
const router = Router();

router.get('/total_sales', adminAuth('Dashboard:total_sales'), totalSales)
router.get('/total_purchase', adminAuth('Dashboard:total_purchase'), totalPurchase)
router.get('/total_receive', adminAuth('Dashboard:total_receive'), totalReceivedAmount)
router.get('/total_payment', adminAuth('Dashboard:total_payment'), totalPaymentAmount)

// ++++++++++++++++++++++++++++++++++++++++ TYPE C ++++++++++++++++++++++++++++++++++++++++++++++++++++++=
router.get('/C_total_receive', adminAuth('Dashboard Cash:total_receive'), totalCashReceivedAmount)
router.get('/C_total_payment', adminAuth('Dashboard Cash:total_payment'), totalCashPaymentAmount)
router.get('/C_total_sales', adminAuth('Dashboard Cash:total_sales'), totalCashSales)
router.get('/C_total_purchase', adminAuth('Dashboard Cash:total_purchase'), totalCashPurchase)

module.exports = router;