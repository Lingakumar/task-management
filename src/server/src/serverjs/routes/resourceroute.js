var express = require('express');
var app = express.Router({mergeParams: true});

const adminController = require("../controller/auth");

app.post("/create", (req, res) => adminController.checkUserAuthentication(req, res, "create_resources"));
app.post("/allocate-project", (req, res) => adminController.checkUserAuthentication(req, res, "allocate_project"));
app.put("/update", (req, res) => adminController.checkUserAuthentication(req, res, "update_resource_details"));
app.put("/exit", (req, res) => adminController.checkUserAuthentication(req, res, "exit_resource"));
app.put("/update-resource-info", (req, res) => adminController.checkUserAuthentication(req, res, "update_resource_project_info"));
app.delete("/release-resource", (req, res) => adminController.checkUserAuthentication(req, res, "release_from_project"));
app.delete("/remove", (req, res) => adminController.checkUserAuthentication(req, res, "delete_resource"));
app.post("/viewresource-details", (req, res) => adminController.checkUserAuthentication(req, res, "view_resource_details"));
app.post("/getresources", (req, res) => adminController.checkUserAuthentication(req, res, "get_all_resources"));
app.post("/check-resource-availability", (req, res) => adminController.checkUserAuthentication(req, res, "check_resource_availability"));
app.post("/getpendingstatus", (req,res) => adminController.checkUserAuthentication(req, res, "get_pending_status"));
app.post("/get-project-resources", (req, res) => adminController.checkUserAuthentication(req, res, "get_project_resources"));
app.post("/get-available-resources", (req, res) => adminController.checkUserAuthentication(req, res, "get_available_resource"));
app.put("/modifyPendingRequests", (req, res) => adminController.checkUserAuthentication(req, res, "respond_to_request"));
app.post("/getresourcecount", (req , res) => adminController.checkUserAuthentication(req, res, "get_resource_count"));

module.exports = app;