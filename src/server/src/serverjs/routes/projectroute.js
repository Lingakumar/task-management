
const express = require('express');
const app = express.Router();
const DBNAME = "rmt";
const collectionName = "project";
const projectController = require('../controller/project');
const dbUtil = require("../model/dbUtil");
const util = require('../utils/util');

const adminController = require('../controller/auth');

app.post("/create", (req, res) => adminController.checkUserAuthentication(req, res, "create_client"));
app.post("/addProject",  (req, res) => adminController.checkUserAuthentication(req, res, "add_project"));
app.delete("/removeProject",  (req, res) => adminController.checkUserAuthentication(req, res, "remove_project"));
app.delete("/remove", (req, res) => adminController.checkUserAuthentication(req, res, "delete_client"));
app.put("/update", (req, res) => adminController.checkUserAuthentication(req, res, "edit_client_data"));
app.post("/add-resource-cost", (req, res) => adminController.checkUserAuthentication(req, res, "add_project_cost"));
//app.put("/update-resource-cost", (req, res) => adminController.checkUserAuthentication(req, res, "edit_project_cost"));
app.post("/getAllProjects", (req, res) => adminController.checkUserAuthentication(req, res, "get_all_projects"));
app.post("/get", (req, res) => adminController.checkUserAuthentication(req, res, "get_project_info"));

module.exports = app;