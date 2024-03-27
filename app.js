require("dotenv").config();
const express = require("express");
var cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

const adminRouter = require("./route/adminRoute");
app.use("/admin", adminRouter);

// const postRoutes = require("./route/postRoute")
// app.use("/post", postRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));