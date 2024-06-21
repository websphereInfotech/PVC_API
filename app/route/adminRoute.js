
const ProFormaInvoice = require("./ProFormaInvoice");
const debitNoteRoute = require('./debitnoteRoute');
const creditNoteRoute = require('./creditnote');
const expenseRoute = require("./expenseRoute");
const salesinvoiceRoute = require("./salesinvoiceRoute");
const deliverychallanRoute = require("./DeliveryChallanRoute");
const paymentRoute = require("./paymentRoute");
const stock = require("./stock");
const customerRoute = require("./customer");
const productRoute = require("./product");
// const itemgroupRoute = require("./itemgroup");
// const itemcategoryRoute = require("./itemcategory");
// const unitRoute = require("./unit");
const receiptRoute = require("./receipt");
const permissionRoute = require("./permissions");
const userRoute = require("./user");
const vendorRoute = require("./vendor");
const companyRoute = require("./company");
const receiveCash = require('./receiveCash');
const customerLedger = require('./cusomerLedger');
const purchaseInvoice = require('./purchaseInvoice');
const vendorLedger = require('./vendorLedger');
const claimRoute = require('./claim');
const companyBankDetails = require('./companyBankdetails');
const bom = require('./bom')
const notificationRoute = require('./notification')

module.exports = {
  ProFormaInvoice,
  debitNoteRoute,
  creditNoteRoute,
  expenseRoute,
  salesinvoiceRoute,
  deliverychallanRoute,
  paymentRoute,
  stock,
  customerRoute,
  productRoute,
  // itemgroupRoute,
  // itemcategoryRoute,
  // unitRoute,
  receiptRoute,
  permissionRoute,
  userRoute,
  vendorRoute,
  companyRoute,
  receiveCash,
  customerLedger,
  purchaseInvoice,
  vendorLedger,
  claimRoute,
  companyBankDetails,
  bom,
  notificationRoute
};
