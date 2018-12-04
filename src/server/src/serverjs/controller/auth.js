const util = require('../utils/util.js');

const main_controller = require("./main_controller");
const adminModel = require("../model/userAdminModel");
const resourceController = require("./resource");
const projectController = require("./project");
const accountController = require('./userAdminController');

const getControllerAccesskey = (req, res, controllerKey) => {
    switch(controllerKey) {
        case "create_client": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.createNewProject(req, res)
            }
            return obj;
        }
        case "add_project": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.addProjectToClient(req, res)
            }
            return obj;
        }
        case "remove_project": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.removeprojectFromClient(req, res)
            }
            return obj;
        }
        case "delete_client": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.deleteProject(req, res)
            }
            return obj;
        }
        case "edit_client_data": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.updateProjectData(req, res)
            }
            return obj;
        }
        case "add_project_cost": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.addResourceCost(req, res)
            }
            return obj;
        }
        case "edit_project_cost": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => projectController.updateProjectCost(req, res)
            }
            return obj;
        }
        case "create_resources": {
            let obj = {
                key: ["resource_edit","admin"],
                next: () => resourceController.createResource(req, res)
            }
            return obj;
        }
        case "allocate_project": {
            let obj = {
                key: ["client_edit","request_resource","admin"],
                next: () => resourceController.allocateToProject(req, res)
            }
            return obj;
        }
        case "update_resource_details": {
            let obj = {
                key: ["resource_edit","admin"],
                next: () => resourceController.updateResource(req, res)
            }
            return obj;
        }
        case "exit_resource": {
            let obj = {
                key: ["resource_edit","admin"],
                next: () => resourceController.resourceExit(req, res)
            }
            return obj;
        }
        case "update_resource_project_info": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => resourceController.updateResourceProjectInfo(req, res)
            }
            return obj;
        }
        case "release_from_project": {
            let obj = {
                key: ["request_resource","client_edit","admin"],
                next: () => resourceController.releaseFromProject(req, res)
            }
            return obj;
        }
        case "delete_resource": {
            let obj = {
                key: ["resource_edit","admin"],
                next: () => resourceController.removeResource(req, res)
            }
            return obj;
        }
        case "respond_to_request": {
            let obj = {
                key: ["functional_management","admin"],
                next: () => resourceController.modifyPendingRequests(req, res)
            }
            return obj;
        }
        case "activate_account": {
            let obj = {
                key: ["account","admin"],
                next: () => accountController.activateAccount(req, res)
            }
            return obj;
        }
        case "deactivate_account": {
            let obj = {
                key: ["account","admin"],
                next: () => accountController.deActivateAccount(req, res)
            }
            return obj;
        }
        case "add_privelage_to_user": {
            let obj = {
                key: ["account","admin"],
                next: () =>  accountController.addPrivelageToUser(req, res)
            }
            return obj;
        }
        case "remove_privelage_to_user": {
            let obj = {
                key: ["account","admin"],
                next: () => accountController.removePrivelageFromuser(req, res)
            }
            return obj;
        }
        case "view_resource_details": {
            let obj = {
                key: ["resource_view", "resource_edit", "admin"],
                next: () => resourceController.viewResourceDaetails(req,res)
            }
            return obj;
        }
        case "get_all_resources": {
            let obj = {
                key: ["resource_view", "resource_edit","admin"],
                next: () => resourceController.getAllResources(req, res)
            }
            return obj;
        }
        case "check_resource_availability": {
            let obj = {
                key: ["functional_management", "resource_edit","admin"],
                next: () => resourceController.checkResourceAvailability(req, res)
            }
            return obj;
        }
        case "get_pending_status": {
            let obj = {
                key: ["functional_management","admin"],
                next: () => resourceController.getpendingstatus(req, res)
            }
            return obj;
        }
        case "get_project_resources": {
            let obj = {
                key: ["client_view","client_edit","request_resource","admin"],
                next: () => resourceController.getProjectResources(req, res)
            }
            return obj;
        }
        case "get_available_resource": {
            let obj = {
                key: ["client_edit","admin"],
                next: () => resourceController.getAvailableResources(req, res)
            }
            return obj;
        }
        case "get_resource_count": {
            let obj = {
                key: ["client_view","client_edit","request_resource","admin"],
                next: () => resourceController.getResourcecount(req, res)
            }
            return obj;
        }
        case "get_all_projects": {
            let obj = {
                key: ["client_view","client_edit","request_resource","admin"],
                next: () => projectController.getAllProjects(req, res)
            }
            return obj;
        }
        case "get_project_info": {
            let obj = {
                key: ["client_view","client_edit","request_resource","admin"],
                next: () => projectController.getProjectInfo(req, res)
            }
            return obj;
        }
    }
}

const getUserAccessKey = (req, res) => {
    let session = req.session;
    let message = [];
    if(session) {
        if(session.user) {
            let userSession = session.user;
            let accessKey = userSession.privelage_level || [];
            return accessKey;
        }
    }
    else {
        message.push("There is no active session");
        res.status(401).send(util.returnResp("Failure", message));            
    }
    return [];
}

const Authorizer = {
    checkUserAuthentication(req, res, controllerKey) {
        let access = getControllerAccesskey(req, res, controllerKey);
        let message = [];
        if(access) {
            let accessKey = access.key || [];
            let userData = getUserAccessKey(req, res);
            if(userData && userData.status) {
                return; 
            }
            for(let keyValue of accessKey) {
                if(userData.indexOf(keyValue) != -1) {
                    access.next();
                    return;
                }
            }
            message.push("You are not authorized to access this API");
            res.status(401).send(util.returnResp("Failure", message));            
        }
        else {
            message.push("Unable to get the access value for this API");
            res.status(401).send(util.returnResp("Failure", message));                
        }
    },
    loginToTheAccount(req, res) {
        let message = [];
        if(req.session && !req.session.user) {
            let reqBody = req.body || {};
            let mandatoryFields = [
                {
                    "key": "email_id",
                    "value": reqBody.email_id,
                    "isMandatory": true,
                    "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                },
                {
                    "key": "password",
                    "value": reqBody.password,
                    "isMandatory": true
                }
            ];
            let resObj = util.validateRequestBody(mandatoryFields, reqBody);
            let errors = resObj.errors || [];
            reqBody = resObj.reqBody || {};
            if(errors && errors.length > 0) {
                res.send(util.returnResp("Failure", errors));
                return;
            }
            let email_id = reqBody.email_id;
            let password = reqBody.password;
            adminModel.verifyUser(email_id, password)
            .then(data => {
                if(data && data.message && data.status && data.status == "Failure") {
                    res.send(data);
                }
                else if(data && data.status == "Success" && data.data) {
                    let userData = data.data;
                    let session = req.session || null;
                    if(session) {
                        let response = {};
                        if(userData.privelage_level && userData.privelage_level.length > 0) {
                            let privelage = userData.privelage_level;
                            response = main_controller.getPrivelageKeys(privelage);
                        }
                        session.user = userData;
                        res.cookie('userId',userData.employee_id ? userData.employee_id : "", {Path:"/" , httpOnly: false});
                        res.cookie("userName", userData.name ? userData.name : "", {Path:"/" , httpOnly: false});
                        message.push("You are successfully logged in");
                        res.send(util.returnResp("Success", message, response));
                    }
                    else {
                        message.push("Session in not valid");
                        res.send(util.returnResp("Failure", message));
                    }
                }
                else {
                    message.push("Password entered does not match with the record");
                    res.send(util.returnResp("Failure", message));
                }
            })
            .catch(err => res.send(err));    
        }
        else {
            message.push("Another session is already in active, please logout and try again");
            res.send(util.returnResp("Failure", message));
        }
    },
    logoutfromAccount(req, res) {
        let message = [];
        if(req.session) {
            if(req.session.user) {
                req.session.destroy(function(err) {
                    if(err) {
                        message.push("The user was not signed out, please try to logout again");
                        res.send(util.returnResp("Failure", message));    
                    }
                    else {
                        res.clearCookie("userId");
                        res.clearCookie("userName")
                        message.push("You are successfully logged out");
                        res.send(util.returnResp("Success", message));
                    }
                });        
            }
            else {
                message.push("You dont have active session to logout");
                res.send(util.returnResp("Failure", message));
            }
        }
        else {
            message.push("Session in not valid");
            res.send(util.returnResp("Failure", message));
        }
    }
}

module.exports = Authorizer;