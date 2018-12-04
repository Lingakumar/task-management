var express = require('express');
var app = express.Router({mergeParams: true});

const adminController = require("../controller/auth");

app.post("/activate-account", (req, res) => adminController.checkUserAuthentication(req, res, "activate_account"));
app.post("/deactivate-account", (req, res) => adminController.checkUserAuthentication(req, res, "deactivate_account"));
app.post("/add_privelage", (req, res) => adminController.checkUserAuthentication(req, res, "add_privelage_to_user"));
app.post("/remove_privelage", (req, res) => adminController.checkUserAuthentication(req, res, "remove_privelage_to_user"));

module.exports = app;