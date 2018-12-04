var express = require('express');
var app = express.Router({mergeParams: true});

const authorizerController = require("../controller/auth");

app.post("/login", (req, res) => authorizerController.loginToTheAccount(req, res));
app.get("/logout", (req, res) => authorizerController.logoutfromAccount(req, res))

module.exports = app;