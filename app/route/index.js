const {Router} = require("express");

const router = Router();

router.use('/', require('./user'))
router.use('/profromainvoice', require('./ProFormaInvoice'))
router.use('/debitnote', require('./debitnoteRoute'))
router.use('/salesinvoice', require('./salesinvoiceRoute'))
router.use('/deliverychallan', require('./DeliveryChallanRoute'));
router.use('/payment', require('./paymentRoute'))
router.use('/item', require('./item'))
router.use('/purchaseinvoice', require('./purchaseInvoice'))
router.use('/permission', require('./permissions'))
router.use('/company', require('./company'))
router.use('/creditnote', require('./creditnote'))
router.use('/receive', require('./receiptRoute'))
router.use('/claim', require('./claim'))
router.use('/companybank', require('./companyBankdetails'))
router.use('/bom', require('./bom'))
router.use('/stock', require('./stock'))
router.use('/notification', require('./notification'))
router.use('/salary', require('./salary'))
router.use('/machine', require('./Machine'))
router.use('/regularMaintenance', require('./regularMaintenance'))
router.use('/preventiveMaintenance', require('./preventiveMaintenance'))
router.use('/breakdownMaintenance', require('./breakdownMaintenance'))
router.use('/dashboard', require('./dashboard'))
router.use('/itemGroup', require('./itemGroup'))
router.use('/itemCategory', require('./itemCategory'))
router.use('/account', require('./account'))
router.use('/ledger', require('./ledger'))
router.use('/schedule', require('./machineSchedule'))
router.use('/purchaseOrder', require('./purchaseOrder'))
router.use('/wastage', require('./wastage'))
router.use('/maintenanceType', require('./maintenanceType'))
router.use('/purpose', require('./purpose'))

module.exports = router;