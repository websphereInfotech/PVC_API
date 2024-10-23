require("dotenv").config();
const express = require("express");
const cors = require("cors");
const moment = require("moment");
const path = require("node:path");
const fs = require("node:fs");
const initRoutes = require("./app/route");
const app = express();
const port = process.env.PORT;

const logRequestMiddleware = (req, res, next) => {
  const logDate = moment().format("DD-MM-YYYY");
  const logFilePath = path.join(__dirname, "storage", `${logDate}.log`);
  const logEntry = {
    timestamp: moment().format(),
    method: req.method,
    endpoint: req.originalUrl,
    body: JSON.stringify(req.body) || "",
    token: req.headers["token"] || "",
  };

  const logMessage = `${JSON.stringify(logEntry)}\n`;

  fs.mkdir(path.dirname(logFilePath), { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating storage directory:", err);
      return;
    }
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  });
  next();
};

require("./app/util/cron");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));
app.use(cors());

app.use(express.json());

app.use(logRequestMiddleware);

app.use("/admin", initRoutes);

app.get("/", (req, res) => res.send("Hello World PVC!"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));
