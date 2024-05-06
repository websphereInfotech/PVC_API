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
    userRoute,
    vendorRoute
} = require('./app/route/adminRoute');


app.use("/admin", ProFormaInvoice);
app.use("/admin", salesreturnRoute);
app.use("/admin", expenseRoute);
app.use("/admin", salesinvoiceRoute);
app.use("/admin", deliverychallanRoute);
app.use("/admin", purchaseRoute);
app.use("/admin", paymentRoute);
app.use("/admin", stockRoute);
app.use("/admin", customerRoute);
app.use("/admin", productRoute);
app.use("/admin", itemgroupRoute);
app.use("/admin", itemcategoryRoute);
app.use("/admin", unitRoute);
app.use("/admin", purchaseBill);
app.use("/admin", purchaseReturn);
app.use("/admin", receiptRoute);
app.use("/admin", bankAccount);
app.use("/admin", permissionRoute);
app.use("/admin", userRoute);
app.use("/admin", vendorRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));