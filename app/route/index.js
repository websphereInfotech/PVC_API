const {Router} = require("express");

const router = Router();

router.use('/', require('./user'))
router.use('/profromainvoice', require('./ProFormaInvoice'))
router.use('/debitnote', require('./debitnoteRoute'))
router.use('/salesinvoice', require('./salesinvoiceRoute'))
router.use('/deliverychallan', require('./DeliveryChallanRoute'));
router.use('/payment', require('./paymentRoute'))
router.use('/customer', require('./customer'))
router.use('/product', require('./product'))
router.use('/purchaseinvoice', require('./purchaseInvoice'))
router.use('/permission', require('./permissions'))
router.use('/vendor', require('./vendor'))
router.use('/company', require('./company'))
router.use('/creditnote', require('./creditnote'))
router.use('/receive', require('./receiveCash'))
router.use('/customerledger', require('./cusomerLedger'))
router.use('/vendorledger', require('./vendorLedger'))
router.use('/claim', require('./claim'))
router.use('/companybank', require('./companyBankdetails'))
router.use('/bom', require('./bom'))
router.use('/stock', require('./stock'))
router.use('/notification', require('./notification'))
router.use('/rawMaterial', require('./rawMaterial'))

module.exports = router;