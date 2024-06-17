require("dotenv").config();
const express = require("express");
var cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT;
// require('./app/models/companyUser.js')
app.use(cors());

app.use(express.json());

const {
    ProFormaInvoice,
    debitNoteRoute,
    expenseRoute,
    salesinvoiceRoute,
    deliverychallanRoute,
    paymentRoute,
    stockRoute,
    customerRoute,
    productRoute,
    // itemgroupRoute,
    // itemcategoryRoute,
    // unitRoute,
    purchaseInvoice,
    receiptRoute,
    permissionRoute,
    userRoute,
    vendorRoute,
    companyRoute,
    creditNoteRoute,
    receiveCash,
    customerLedger,
    vendorLedger,
    claimRoute,
    companyBankDetails
} = require('./app/route/adminRoute');


app.use("/admin", userRoute);
app.use("/admin/profromainvoice", ProFormaInvoice);
app.use("/admin/debitnote", debitNoteRoute);
app.use("/admin/salesinvoice", salesinvoiceRoute);
app.use("/admin/deliverychallan", deliverychallanRoute);
app.use("/admin/payment", paymentRoute);
app.use("/admin/customer", customerRoute);
app.use("/admin/product", productRoute);
app.use("/admin/purchaseinvoice", purchaseInvoice);
app.use("/admin/permission", permissionRoute);
app.use("/admin/vendor", vendorRoute);
app.use("/admin/company", companyRoute);
app.use("/admin/creditnote",creditNoteRoute);
app.use("/admin/receive",receiveCash);
app.use("/admin/customerledger",customerLedger);
app.use("/admin/vendorledger",vendorLedger);
app.use("/admin/claim",claimRoute);
app.use("/admin/companybank",companyBankDetails);

app.use("/admin", receiptRoute);
app.use("/admin", stockRoute);
app.use("/admin", expenseRoute);
// app.use("/admin", itemgroupRoute);
// app.use("/admin", itemcategoryRoute);
// app.use("/admin", unitRoute);
// app.use("/admin", bankAccount);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));