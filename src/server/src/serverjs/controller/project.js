const util = require('../utils/util.js');

const clientModel = require('../model/clientModel');
const projectModel = require('../model/project');

const Projects = {
    createNewProject(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "client_name",
                "value": reqBody.client_name,
                "isMandatory": true
            },
            {
                "key": "project_name",
                "value": reqBody.project_name,
                "isMandatory": true
            },
            {
                "key": "start_Date",
                "value": reqBody.start_Date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "end_Date",
                "value": reqBody.end_Date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "sow",
                "value": reqBody.sow,
                "isMandatory": true
            },
            {
                "key": "project_cost",
                "value": reqBody.project_cost,
                "isMandatory": true
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        let startDate = new Date(reqBody.start_Date).getTime();
        let endDate = new Date(reqBody.end_Date).getTime();
        if(endDate <= startDate) {
            errors.push("Start date value should be less than the end date");    
        }
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let session = req.session ? req.session : {};
        let emp_id = session.user && session.user.employee_id ? session.user.employee_id : "";
        let projectObj = {
            client_name: reqBody.client_name,
            owner_id: emp_id,
            projects: [{
                owner_id: emp_id,
                project_id : reqBody.project_id,
                project_name : reqBody.project_name,
                sow: reqBody.sow,
                start_Date: reqBody.start_Date,
                end_Date: reqBody.end_Date,
                project_cost: reqBody.project_cost,
                status: "OPEN"
            }]
        }
        clientModel.createNewProject(projectObj)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    deleteProject(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let mandatoryFields = [
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        clientModel.deleteProject(reqBody.client_id)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    addProjectToClient(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            },
            {
                "key": "project_name",
                "value": reqBody.project_name,
                "isMandatory": true
            },
            {
                "key": "start_Date",
                "value": reqBody.start_Date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "end_Date",
                "value": reqBody.end_Date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "sow",
                "value": reqBody.sow,
                "isMandatory": true
            },
            {
                "key": "project_cost",
                "value": reqBody.project_cost,
                "isMandatory": true
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        let startDate = new Date(reqBody.start_Date).getTime();
        let endDate = new Date(reqBody.end_Date).getTime();
        if(endDate <= startDate) {
            errors.push("Start date value should be less than the end date");    
        }
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let session = req.session ? req.session : {};
        let emp_id = session.user && session.user.employee_id ? session.user.employee_id : "";
        let projectObj = {
            owner_id: emp_id,
            project_id : reqBody.project_id,
            project_name : reqBody.project_name,
            sow: reqBody.sow,
            start_Date: reqBody.start_Date,
            end_Date: reqBody.end_Date,
            project_cost: reqBody.project_cost,
            status : "OPEN"
        }
        projectModel.addProjectToClient(reqBody.client_id, projectObj)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    removeprojectFromClient(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        projectModel.removeProjectFromClient(reqBody.client_id, reqBody.project_id)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    updateProjectData(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let message = [];
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": false
            },
            {
                "key": "client_name",
                "value": reqBody.client_name,
                "isMandatory": false
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            },
            {
                "key": "project_name",
                "value": reqBody.project_name,
                "isMandatory": false
            },
            {
                "key": "start_Date",
                "value": reqBody.start_Date,
                "isMandatory": false,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "end_Date",
                "value": reqBody.end_Date,
                "isMandatory": false,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "sow",
                "value": reqBody.sow,
                "isMandatory": false
            },
            {
                "key": "project_cost",
                "value": reqBody.project_cost,
                "isMandatory": false
            }
        ];
        let updateObj = {};
        if("project_id" in reqBody || "client_name" in reqBody) {
            let resObj = util.validateRequestBody(mandatoryFields, reqBody);
            let errors = resObj.errors || [];
            reqBody = resObj.reqBody || {};
            let startDate = new Date(reqBody.start_Date).getTime();
            let endDate = new Date(reqBody.end_Date).getTime();
            if(endDate <= startDate) {
                errors.push("Start date value should be less than the end date");    
            }
            if(errors && errors.length > 0) {
                res.send(util.returnResp("Failure", errors));
                return;
            }
            if("project_id" in reqBody) {
                let clientFields = [
                    "project_name",
                    "start_Date",
                    "end_Date",
                    "sow",
                    "project_cost"
                ]
                if("client_name" in reqBody) {
                    updateObj.client_name = reqBody.client_name;
                }
                let fields = util.getAvailableFields(clientFields, reqBody);
                let reqBodyFields = Object.keys(fields);
                reqBodyFields.map(value => {
                    updateObj[`projects.$.${value}`] = reqBody[value];
                })
            }
            else if("client_name" in reqBody) {
                updateObj.client_name = reqBody.client_name;
            }
            projectModel.updateProjectData(reqBody.client_id, reqBody.project_id, updateObj)
            .then(data => res.send(data))
            .catch(err => res.send(err));    
        }
        else {
            message.push("Client name or Project id is a mandatory field");
            res.send(util.returnResp("Failure", message));
            return;
        }
    },
    validateResourceCostData(reqBody) {
        let message = [];
        let mandatoryFields = [
            {
                "key": "resource_cost",
                "value": reqBody.resource_cost,
                "isMandatory": true,
                "type": "Array"
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true,
            },
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true,
            }
        ];
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            return (util.returnResp("Failure", errors));
        }
        let cost = reqBody.resource_cost || [];
        let resourceRoleFields = [];
        cost.map((resourceCost, index) => {
            if(resourceCost) {
                let resourceObj = {
                    resource_Cost: resourceCost.resource_cost,
                    resourceRole: resourceCost.role,
                    resourceCount: resourceCost.count,
                    costPerResource: resourceCost.cost_per_resource
                }
                let resourceCostPattern = new RegExp("^\\d+");
                if(resourceRoleFields.indexOf(resourceObj.resourceRole) == -1) {
                    for(let resourceKey in resourceObj) {
                        if(typeof(resourceObj[resourceKey]) == "undefined") {
                            message.push(`${resourceKey} for index ${index} is a mandatory field`);
                        }
                        else if(resourceObj[resourceKey].trim() == "") {
                            message.push(`${resourceKey} for index ${index} cannot be empty`)
                        }
                        else if(resourceKey != "resourceRole") {
                            if(!resourceCostPattern.test(resourceObj[resourceKey])) {
                                message.push(`${resourceKey} for index ${index} is not a valid number`)
                            }    
                        }
                    }
                    resourceRoleFields.push(resourceObj.resourceRole);
                }
                else {
                    cost.splice(index, 1);
                }
            }
        });
        if(message.length > 0) {
            return util.returnResp("Failure", message);
        }
        return cost;
    },
    addResourceCost(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let resp = this.validateResourceCostData(reqBody);
        if(resp.status == "Failure") {
            res.send(resp);
            return;
        }
        else {
            let client_id = reqBody.client_id;
            let project_id = reqBody.project_id;
            let resourceCost = resp;
            clientModel.addResourceCost(client_id, project_id, resourceCost)
            .then(data => res.send(data))
            .catch(err => res.send(err));    
        }
    },
    updateProjectCost(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let resp = this.validateResourceCostData(reqBody);
        let resourcekey = new Map();
        if(resp.status == "Failure") {
            res.send(resp);
            return;
        }
        else {
            let client_id = reqBody.client_id;
            let project_id = reqBody.project_id;
            let resourceCost = resp;
            resourceCost.map(resourceRole => {
                resourcekey.set(resourceRole.role, resourceRole.resource_cost);
            });
            clientModel.updateResourceCost(client_id, project_id, resourcekey)
            .then(data => res.send(data))
            .catch(err => res.send(err));    
        }
    },
    getAllProjects(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let session = req.session ? req.session : {};
        let emp_id = session.user && session.user.employee_id ? session.user.employee_id : ""
        let reqObj = {
            "limit": reqBody.limit || 10,
            "page": reqBody.page || 1,
            "filters": reqBody.filters || [],
            "employee_id": emp_id
        };
        clientModel.getAllProjects(reqObj)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    getProjectInfo(req, res) {
        let reqBody = req && req.body ? req.body : {};
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let client_id = reqBody.client_id;
        let project_id = reqBody.project_id;
        this.getProjectById(client_id, project_id)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    /* this method is used for getting the project info abd called from external API. this is used for resource cost prefilled data*/
    getProjectById(clientId, projectId) {
        let reqObj = {
            client_id: clientId,
            project_id: projectId
        }
        return clientModel.getProjectInfo(reqObj)
        .then(data => data) 
        .catch(err => err);
    }
};

module.exports = Projects;