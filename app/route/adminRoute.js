
const ProFormaInvoice = require("./ProFormaInvoice");
const debitNoteRoute = require('./debitnoteRoute');
const creditNoteRoute = require('./creditnote');
const expenseRoute = require("./expenseRoute");
const salesinvoiceRoute = require("./salesinvoiceRoute");
const deliverychallanRoute = require("./DeliveryChallanRoute");
const paymentRoute = require("./paymentRoute");
const stockRoute = require("./stockRoute");
const customerRoute = require("./customer");
const productRoute = require("./product");
const itemgroupRoute = require("./itemgroup");
const itemcategoryRoute = require("./itemcategory");
const unitRoute = require("./unit");
const receiptRoute = require("./receipt");
const permissionRoute = require("./permissions");
const userRoute = require("./user");
const vendorRoute = require("./vendor");
const companyRoute = require("./company");
const receiveCash = require('./receiveCash');
const paymentCash = require('./paymentCash');
const customerLedger = require('./cusomerLedger');
const purchaseInvoice = require('./purchaseInvoice');
const vendorLedger = require('./vendorLedger');
const claimRoute = require('./claim');

module.exports = {
  ProFormaInvoice,
  debitNoteRoute,
  creditNoteRoute,
  expenseRoute,
  salesinvoiceRoute,
  deliverychallanRoute,
  paymentRoute,
  stockRoute,
  customerRoute,
  productRoute,
  itemgroupRoute,
  itemcategoryRoute,
  unitRoute,
  receiptRoute,
  permissionRoute,
  userRoute,
  vendorRoute,
  companyRoute,
  receiveCash,
  paymentCash,
  customerLedger,
  purchaseInvoice,
  vendorLedger,
  claimRoute
};
