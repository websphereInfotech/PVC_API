require("dotenv").config();
const express = require("express");
var cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT;

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
    itemgroupRoute,
    itemcategoryRoute,
    unitRoute,
    purchaseInvoice,
    receiptRoute,
    permissionRoute,
    userRoute,
    vendorRoute,
    companyRoute,
    creditNoteRoute,
    receiveCash,
    paymentCash,
    customerLedger,
    vendorLedger,
    claimRoute
} = require('./app/route/adminRoute');


app.use("/admin", ProFormaInvoice);
app.use("/admin", debitNoteRoute);
app.use("/admin", expenseRoute);
app.use("/admin", salesinvoiceRoute);
app.use("/admin", deliverychallanRoute);
app.use("/admin", paymentRoute);
app.use("/admin", stockRoute);
app.use("/admin", customerRoute);
app.use("/admin", productRoute);
app.use("/admin", itemgroupRoute);
app.use("/admin", itemcategoryRoute);
app.use("/admin", unitRoute);
app.use("/admin", purchaseInvoice);
app.use("/admin", receiptRoute);
// app.use("/admin", bankAccount);
app.use("/admin", permissionRoute);
app.use("/admin", userRoute);
app.use("/admin", vendorRoute);
app.use("/admin", companyRoute);
app.use("/admin",creditNoteRoute);
app.use("/admin",receiveCash);
app.use("/admin",paymentCash);
app.use("/admin",customerLedger);
app.use("/admin",vendorLedger);
app.use("/admin",claimRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));