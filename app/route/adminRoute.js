// const loginRoute = require("./loginRoute");
const quotationRoute = require("./quotationRoute");
const salesreturnRoute = require("./salesreturnRoute");
const expenseRoute = require("./expenseRoute");
const salesinvoiceRoute = require("./salesinvoiceRoute");
const deliverychallanRoute = require("./DeliveryChallanRoute");
const purchaseRoute = require("./purchaseOrderRoute");
const paymentRoute = require("./paymentRoute");
const stockRoute = require("./stockRoute");
const customerRoute = require("./customer");
const productRoute = require("./product");
const itemgroupRoute = require("./itemgroup");
const itemcategoryRoute = require("./itemcategory");
const unitRoute = require("./unit");
const purchaseBill = require("./purchasebill");
const purchaseReturn = require("./purchaseReturn");
const receiptRoute = require("./receipt");
const bankAccount = require("./bankRoute");
const permissionRoute = require("./permissions");
const userRoute = require("./user");
module.exports = {
  quotationRoute,
  salesreturnRoute,
  expenseRoute,
  salesinvoiceRoute,
  deliverychallanRoute,
  purchaseRoute,
  paymentRoute,
  stockRoute,
  customerRoute,
  productRoute,
  itemgroupRoute,
  itemcategoryRoute,
  unitRoute,
  purchaseBill,
  purchaseReturn,
  receiptRoute,
  bankAccount,
  permissionRoute,
  userRoute
};
