require("dotenv").config();
const express = require("express");
const cors = require("cors");
const initRoutes = require("./app/route");
const app = express();
const port = process.env.PORT;
require('./app/util/cron')
app.use(cors());

app.use(express.json());

app.use('/admin', initRoutes)

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));