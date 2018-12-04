const express = require('express');
const app = express.Router();
const adminController = require("../controller/auth");
app.post("/getdata", (req, res) => adminController.checkUserAuthentication(req, res, "getTdata"));
module.exports = app;