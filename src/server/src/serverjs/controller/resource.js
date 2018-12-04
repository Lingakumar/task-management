const util = require('../utils/util.js');

const resourceModel = require('../model/resource');
const resource_history_model = require('../model/resourceHistory');
const resource_mapper = require('../model/resourceMapper');
const projectController = require('./project');

const Resources = {
    createResource(req, res) {
        let reqBody = req.body || {};
        let employee_id = reqBody.employee_id;
        let mandatoryFields = [
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            {
                "key": "name",
                "value": reqBody.name,
                "isMandatory": true,
                "pattern": "^[a-zA-Z  |]*$"
            },
            {
                "key": "email_id",
                "value": reqBody.email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "formatType": "email"
            },
            {
                "key": "personal_email_id",
                "value": reqBody.personal_email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "formatType": "email"            
            },
            {
                "key": "gender",
                "value": reqBody.gender,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "nationality",
                "value": reqBody.nationality,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "mobile_phone_number",
                "value": reqBody.mobile_phone_number,
                "isMandatory": true,
                "pattern": "^\\d{10,16}$",
                "formatType": "mobile number"
            },
            {
                "key": "alternate_mobile_Number",
                "value": reqBody.alternate_mobile_Number,
                "isMandatory": false,
                "pattern": "^\\d{10,16}$",
                "formatType": "mobile number"
            },
            {
                "key": "address_line_1",
                "value": reqBody.address_line_1,
                "isMandatory": true,
                "pattern": /^[a-zA-Z0-9\s,.'-]{3,}$/,
                "formatType": "address"
            },
            {
                "key": "address_line_2",
                "value": reqBody.address_line_2,
                "isMandatory": false,
                "pattern": /^[a-zA-Z0-9\s,.'-]{3,}$/,
                "formatType": "address"
            },
            {
                "key": "city",
                "value": reqBody.city,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "state",
                "value": reqBody.state,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "country",
                "value": reqBody.country,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "pincode",
                "value": reqBody.pincode,
                "isMandatory": true,
                "pattern": /^[a-zA-Z0-9 -]{4,10}$/
            },
            {
                "key": "primary_skill",
                "value": reqBody.primary_skill,
                "isMandatory": true,
                "type": "Array"
            },
            {
                "key": "secondary_skills",
                "value": reqBody.secondary_skills,
                "isMandatory": false,
                "type": "Array"
            },
            {
                "key": "experience",
                "value": reqBody.experience,
                "isMandatory": true,
                "pattern": "^[+]?([0-9]*[.])?[0-9]+$",
                "formatType": "number"
            },
            {
                "key": "designation",
                "value": reqBody.designation,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "date_of_joining",
                "value": reqBody.date_of_joining,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "date_of_birth",
                "value": reqBody.date_of_birth,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "pan_number",
                "value": reqBody.pan_number,
                "isMandatory": false,
                "pattern": "[A-Za-z]{5}\d{4}[A-Za-z]{1}"
            },
            {
                "key": "account_number",
                "value": reqBody.account_number,
                "isMandatory": false,
                "pattern": /^[a-zA-Z0-9]{6,16}$/
            },
            {
                "key": "passport",
                "value": reqBody.passport,
                "isMandatory": false,
                "type": "boolean"
            },
            {
                "key": "blood_group",
                "value": reqBody.blood_group,
                "isMandatory": true,
            },
            {
                "key": "UAN_number",
                "value": reqBody.UAN_number,
                "isMandatory": false,
                "pattern": "^\\d+$"
            },
            {
                "key": "in_Notice_Period",
                "value": reqBody.in_Notice_Period,
                "isMandatory": false
            },
            {
                "key": "department",
                "value": reqBody.department,
                "isMandatory": true,
                "pattern": /^[a-zA-Z ]*$/
            }
        ]
        if(reqBody.designation != "CEO" && reqBody.designation != "CTO") {
            mandatoryFields.push(
                {
                    "key": "functional_manager_id",
                    "value": reqBody.functional_manager_id,
                    "isMandatory": true,
                    "pattern": ""
                },
                {
                    "key": "functional_manager_name",
                    "value": reqBody.functional_manager_name,
                    "isMandatory": true,
                    "pattern": ""
                }
            );
        }
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        let currentDate = new Date().getTime();
        let date_of_joining = new Date(reqBody.date_of_joining).getTime();
        let date_of_birth = new Date(reqBody.date_of_birth).getTime();
        if(currentDate <= date_of_joining) {
            errors.push("Date of joining cannot be a future date.");
        }
        if(currentDate <= date_of_birth) {
            errors.push("Date of birth cannot be a future date.");
        }
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let dataObj = {
            employee_id: employee_id,
            name: reqBody.name,
            email_id: reqBody.email_id,
            personal_email_id: reqBody.personal_email_id,
            gender: reqBody.gender,
            nationality: reqBody.nationality,
            mobile_phone_number: reqBody.mobile_phone_number,
            alternate_mobile_Number: reqBody.alternate_mobile_Number,
            address_line_1: reqBody.address_line_1,
            address_line_2: reqBody.address_line_2 || "",
            city: reqBody.city,
            state: reqBody.state,
            country: reqBody.country,
            pincode: reqBody.pincode,
            primary_skill: reqBody.primary_skill,
            secondary_skills: reqBody.secondary_skills || [],
            experience: reqBody.experience || "",
            designation: reqBody.designation,
            date_of_joining: reqBody.date_of_joining,
            date_of_birth: reqBody.date_of_birth,
            pan_number: reqBody.pan_number || "",
            account_number: reqBody.account_number || "",
            passport: reqBody.passport || false,
            blood_group: reqBody.blood_group || "",
            UAN_number: reqBody.UAN_number || "",
            in_Notice_Period: false,
            department: reqBody.department
        }
        let resource_mapper_object = {
            employee_id: employee_id,
            name: reqBody.name,
            email_id: reqBody.email_id,
            primary_skill: reqBody.primary_skill,
            secondary_skills: reqBody.secondary_skills || [],
            designation: reqBody.designation,
            projects: [],
            functional_manager_id: reqBody.functional_manager_id,
            functional_manager_name: reqBody.functional_manager_name,
            department: reqBody.department
        }
        if(reqBody.designation != "CEO" && reqBody.designation != "CTO") {
            dataObj.functional_manager_name = reqBody.functional_manager_name || "";
            dataObj.functional_manager_id = reqBody.functional_manager_id || "";
        }
        resourceModel.createResource(dataObj)
        .then(data => {
            let resp = data.resp || data;
            let mapperObj = {
                db: data.db,
                data: resource_mapper_object,
                message: resp.message
            }
            console.log(mapperObj);
            //data.data = resource_mapper_object;
            console.log(data);
            if(resp.status == "Success") {
                resource_mapper.createResource(mapperObj)
                .then(mapperData => {
                    res.send(resp);
                    console.log(mapperData);
                })
                .catch(err => res.send(err));
            }
            else {
                res.send(resp);
            }
        })
        .catch(err => {
            let message = [];
            message.push("There was some error while creating resources");
            res.send(util.returnResp("Failure", message, err));
        });
    },
    async updateResource(req, res) {
        let reqBody = req.body || {};
        let employee_id = reqBody.employee_id;
        let message = [];
        if("email_id" in reqBody) {
            message.push("Email field canot be changed / modified");
            res.send (util.returnResp("Failure", message));
        }
        let mandatoryFields = [
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$",
                "formatType": "number"
            },
            {
                "key": "name",
                "value": reqBody.name,
                "isMandatory": false,
                "pattern": "^[a-zA-Z |]*$"
            },
            {
                "key": "personal_email_id",
                "value": reqBody.personal_email_id,
                "isMandatory": false,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ,
                "formatType": "email"           
            },
            {
                "key": "gender",
                "value": reqBody.gender,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "nationality",
                "value": reqBody.nationality,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "mobile_phone_number",
                "value": reqBody.mobile_phone_number,
                "isMandatory": false,
                "pattern": "^\\d{10,16}$",
                "formatType": "mobile number"
            },
            {
                "key": "alternate_mobile_Number",
                "value": reqBody.alternate_mobile_Number,
                "isMandatory": false,
                "pattern": "^\\d{10,16}$",
                "formatType": "mobile number"
            },
            {
                "key": "address_line_1",
                "value": reqBody.address_line_1,
                "isMandatory": false,
                "pattern": /^[a-zA-Z0-9\s,.'-]{3,}$/,
                "formatType": "address"
            },
            {
                "key": "address_line_2",
                "value": reqBody.address_line_2,
                "isMandatory": false,
                "pattern": /^[a-zA-Z0-9\s,.'-]{3,}$/,
                "formatType": "address"
            },
            {
                "key": "city",
                "value": reqBody.city,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "state",
                "value": reqBody.state,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "country",
                "value": reqBody.country,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "pincode",
                "value": reqBody.pincode,
                "isMandatory": false,
                "pattern": /^[a-zA-Z0-9 -]{4,10}$/
            },
            {
                "key": "primary_skill",
                "value": reqBody.primary_skill,
                "isMandatory": false,
                "type": "Array"
            },
            {
                "key": "secondary_skills",
                "value": reqBody.secondary_skills,
                "isMandatory": false,
                "type": "Array"
            },
            {
                "key": "experience",
                "value": reqBody.experience,
                "isMandatory": false,
                "pattern": "^[+]?([0-9]*[.])?[0-9]+$",
                "formatType": "number"
            },
            {
                "key": "designation",
                "value": reqBody.designation,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "date_of_birth",
                "value": reqBody.date_of_birth,
                "isMandatory": false,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "pan_number",
                "value": reqBody.pan_number,
                "isMandatory": false,
                "pattern": "[A-Za-z]{5}\d{4}[A-Za-z]{1}"
            },
            {
                "key": "account_number",
                "value": reqBody.account_number,
                "isMandatory": false,
                "pattern": /^[a-zA-Z0-9]{6,16}$/
            },
            {
                "key": "passport",
                "value": reqBody.passport,
                "isMandatory": false,
                "type": "boolean"
            },
            {
                "key": "blood_group",
                "value": reqBody.blood_group,
                "isMandatory": false,
            },
            {
                "key": "UAN_number",
                "value": reqBody.UAN_number,
                "isMandatory": false,
                "pattern": "^\\d+$"
            },
            {
                "key": "department",
                "value": reqBody.department,
                "isMandatory": false,
                "pattern": /^[a-zA-Z ]*$/
            },
            {
                "key": "functional_manager_id",
                "value": reqBody.functional_manager_id,
                "isMandatory": false
            },
            {
                "key": "functional_manager_name",
                "value": reqBody.functional_manager_name,
                "isMandatory": false
            }
        ]
        let resource_mapper_fields = [
            "id",
            "name",
            "primary_skill",
            "secondary_skills",
            "designation",
            "functional_manager_id",
            "functional_manager_name",
            "department"
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        let functionalMangerId = reqBody.functional_manager_id;
        let functionalManagerName = reqBody.functional_manager_name;
        if(!((!functionalManagerName && !functionalMangerId) || (functionalManagerName && functionalMangerId))) {
            errors.push("Cannot update one of the two fields. Both Functional manager id and Name must be updated")
        }
        if(employee_id == functionalMangerId) {
            errors.push("Employee id and functional manager id cannot be same");
        }
        let currentDate = new Date().getTime();
        let date_of_joining = new Date(reqBody.date_of_joining).getTime();
        let date_of_birth = new Date(reqBody.date_of_birth).getTime();
        if(currentDate <= date_of_joining) {
            errors.push("Date of joining cannot be a future date.");
        }
        if(currentDate <= date_of_birth) {
            errors.push("Date of birth cannot be a future date.");
        }
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let mapper_fields = util.getAvailableFields(resource_mapper_fields, reqBody);
        if(Object.keys(reqBody).length > 1) {
            let data = [];
            if(functionalManagerName) {
                let leadQuery = {employee_id: functionalMangerId, name: functionalManagerName};
                data = await resource_mapper.getResourceDetails(null, leadQuery);
            }
            if(!functionalManagerName || data.length) {
                let query = {employee_id}
                this.updateResourceDetails(query, reqBody, mapper_fields)
                .then(data => res.send(data))
                .catch(err => res.send(err));      
            }
            else {
                message.push("There is no employee found with the functional manager id and name provided");    
                res.send (util.returnResp("Failure", message));
            }
        }
        else {
            message.push("There was no data to update / modify");
            res.send(util.returnResp("Failure", message));    
        }
    },
    updateResourceDetails(query, reqBody, mapper_fields) {
        return Promise.all([
            resourceModel.updateResource(reqBody, query),
            resource_mapper.updateResource(mapper_fields, query)
        ])
        .then(data => {
            let resourceData = data[0] || {};
            let mapperData = data[1] || {}; 
            console.log(mapperData);
            return (resourceData);
        })
        .catch(err => {
            let message = [];
            message.push("There was some error while creating resources");
            return (util.returnResp("Failure", message, err));
        });
    },
    removeResource(req, res) {
        let reqBody = req.body || {};
        let message = [];
        let mandatoryFields = [
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        Promise.all([
            resourceModel.removeResource(employee_id),
            resource_mapper.removeResource(reqBody.employee_id)
        ])
        .then(obj => {
            let data = obj[0];
            let mapperObj = obj[1];
            console.log(mapperObj);
            if(data.status == "Success") {
                resource_history_model.addResource(data)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    message.push("There was some error while adding resources to history");
                    res.send(util.returnResp("Failure", message, err));
                });        
            }
            else {
                res.send(data);
            }
        })
        .catch(err => {
            message.push("There was some error while deleting resources");
            res.send(util.returnResp("Failure", message, err));
        });
    },
    checkResourceAvailability(req, res) {
        let reqBody = req.body || {};
        let message = [];
        let mandatoryFields = [
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let employee_id = reqBody.employee_id;
        let toFindUser = {employee_id};
        var filters = reqBody.filters && reqBody.filters.length ? reqBody.filters : []
        if(filters.length) {
            if(filters[0].name) {
                filters[0].name = {"$regex": new RegExp(filters[0].name, 'i')};
            }
        }
        if(filters.length) {
            toFindResource = {functional_manager_id: employee_id, $and: filters};
        }
        else {
            toFindResource = {functional_manager_id: employee_id};
        }
        Promise.all([
            resource_mapper.getResourceDetails(null, toFindResource),
            resource_mapper.getResourceDetails(null, toFindUser)
        ])
        .then(data => {
            if(data.length > 0) {
                let functionalResourceData = data[0];
                let userData = data[1];
                if(userData.length > 0) {
                    let obj = {
                        emailid: userData[0].email_id,
                        emp_name: userData[0].name,
                        department: userData[0].department
                    }
                    if(functionalResourceData.length > 0) {
                        obj.availablity = true;
                        obj.functionalResources = functionalResourceData; 
                        message.push("The available resource is found successfully");
                        res.send(util.returnResp("Success", message, obj));
                    }
                    else {
                        obj.availablity = false;
                        message.push("There is no available resource under the user id provided");
                        res.send(util.returnResp("Success", message, obj));
                    }     
                }
                else {
                    message.push("There is no user data provided for the employee id provided");
                    res.send(util.returnResp("Failure", message));                        
                }
            }
            else {
                message.push("There is some error while getting resource data");
                res.send(util.returnResp("Failure", message, obj));
            }
        })
        .catch(err => res.json(err));
    },
    resourceExit(req, res) {
        let message = [];
        let reqBody = req.body || {};
        let mandatoryFields = [
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            {
                "key": "email_id",
                "value": reqBody.email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "formatType": "email"
            },
            {
                "key": "employee_name",
                "value": reqBody.employee_name,
                "isMandatory": true,
            },
            {
                "key": "department",
                "value": reqBody.department,
                "isMandatory": true,
            },
            {
                "key": "date_of_releiving",
                "value": reqBody.date_of_releiving,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "reason",
                "value": reqBody.reason,
                "isMandatory": true
            },
            {
                "key": "acceptance_status",
                "value": reqBody.acceptance_status,
                "isMandatory": true
            },
            {
                "key": "comments",
                "value": reqBody.comments,
                "isMandatory": false
            },
            {
                "key": "replacement_manager_id",
                "value": reqBody.replacement_manager_id,
                "isMandatory": false
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let employee_id = reqBody.employee_id;
        let email_id = reqBody.email_id;
        let department = reqBody.department;
        let employee_name = reqBody.employee_name;
        let replacementmanager = reqBody.replacement_manager_id;
        let userDetailsObj = {
            employee_id,
            email_id,
            department,
            employee_name
        }
        let resourceObj = {
            "in_Notice_Period": true,
            "date_of_releiving": reqBody.date_of_releiving,
            "reason": reqBody.reason,
            "acceptance_status": reqBody.acceptance_status,
            "comments": reqBody.comments
        }
        let query = {employee_id: replacementmanager};
        if(replacementmanager) {
            resource_mapper.getResourceDetails(null, query)
            .then(data => {
                if(data.length) {
                    let functionalManagerName = data[0].name || "";
                    let reqBody = {functional_manager_id: replacementmanager,functional_manager_name: functionalManagerName};
                    let query = {functional_manager_id: employee_id}
                    this.updateResourceDetails(query, reqBody, reqBody)
                    .then(data => {
                        console.log(data);
                        resourceModel.resourceExit(userDetailsObj, resourceObj)
                        .then(data => res.json(data))
                        .catch(err => res.json(err)); 
                    })
                    .catch(err => res.send(err));
                }
                else {
                    message.push("There is no employee found with the functional manager id provided");    
                    res.send (util.returnResp("Failure", message));
                }
            })
            .catch(err => res.json(err));
        }
        else {
            resourceModel.resourceExit(userDetailsObj, resourceObj)
            .then(data => res.json(data))
            .catch(err => res.json(err));    
        }
    },
    allocateToProject(req, res) {
        let reqBody = req.body || {};
        let message = [];
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            },
            {
                "key": "role",
                "value": reqBody.role,
                "isMandatory": true
            },
            {
                "key": "start_date",
                "value": reqBody.start_date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "end_date",
                "value": reqBody.end_date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "allocation",
                "value": reqBody.allocation,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            {
                "key": "name",
                "value": reqBody.name,
                "isMandatory": false
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(parseInt(reqBody.allocation) <= 0) {
            errors.push("The allocation percentage should be greater than zero");
        }
        else if(parseInt(reqBody.allocation) > 100) {
            errors.push("The allocation percentage should not be greater than 100");
        }
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let employee_id = reqBody.employee_id;
        let rname = reqBody.name;
        let projectInfo =  {
            clientId: reqBody.client_id,
            projectId: reqBody.project_id,
            role: reqBody.role,
            start_date: reqBody.start_date,
            end_date: reqBody.end_date,
            allocation: reqBody.allocation,
            status: "pending",
            requestedby : req.session.user && req.session.user.name && req.session.user.name.indexOf("|") >=0 ? req.session.user.name.replace("|"," ") : req.session.user.name,
            requstorEmail: req.session.user.email_id
        }
        let startDate = new Date(reqBody.start_date).getTime();
        let endDate = new Date(reqBody.end_date).getTime();
        if(endDate <= startDate) {
            message.push("Start date value should be less than the end date");    
            res.send (util.returnResp("Failure", message));
            return;
        }
        if(startDate && endDate) {
            resource_mapper.allocateProject(employee_id, projectInfo)
            .then(data => {
                if(projectInfo && data.data && data.data.userData && data.data.userData.length) {
                    let mailContent = {};
                    let fmName = data.data.userData[0].name.toUpperCase();
                    let mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.resourceRequestFMNotification;
                    mailContent.toEmail = data.data.userData[0].email_id;
                    mailContent.subject = "Reg: Resource Request";
                    mailContent.content = mailBodyContent.replace("<FMName>", fmName.replace("|"," ")).replace("<StartDate>", projectInfo.start_date).replace("<EndDate>",projectInfo.end_date).replace("<RName>",rname.replace("|"," ").toUpperCase()).replace("<ProjectName>",projectInfo.projectId).replace("<RRName>",projectInfo.requestedby.toUpperCase());
                    util.sendMailNotification(mailContent);
                }
                delete data.data;
                res.send(data)
            })
            .catch(err => res.send(err));
        }
        else {
            message.push("Please enter date in valid format");    
            res.send (util.returnResp("Failure", message));
        }
    },
    releaseFromProject(req, res) {
        let reqBody = req.body || {};
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            },
            {
                "key": "fmId",
                "value": reqBody.fmId,
                "isMandatory": false
            },
            {
                "key": "rName",
                "value": reqBody.rName,
                "isMandatory": false
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let employee_id = reqBody.employee_id;
        let project_id = reqBody.project_id;
        let client_id = reqBody.client_id;
        let fmId = reqBody.fmId;
        resource_mapper.releaseFromProject(employee_id, project_id, client_id, fmId)
        .then(data => {
            if(data.status.toLowerCase() === "success") {
                let mailContent = {};
                //To trigger mail to resource requestor
                let fmEmail = data.data && data.data.userData[0] && data.data.userData[0].email_id;
                if(fmEmail) {
                    let rrName = req.session.user.name.toUpperCase().replace("|", " ");
                    let rName = reqBody.rName.toUpperCase().replace("|", " ");
                    let fmName = data.data.userData[0].name.toUpperCase().replace("|", " ");
                    let mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.releaseResourceFMNotification;
                    mailContent.toEmail = fmEmail;
                    mailContent.subject = "Reg: Resource Release Notification";
                    mailContent.content = mailBodyContent.replace("<FMName>", fmName).replace("<RRName>",rrName).replace("<ProjectName>",project_id).replace("<RName>",rName);
                    util.sendMailNotification(mailContent);
                }
            }
            res.send(data);
        })
        .catch(err => res.send(err));    
    },
    updateResourceProjectInfo(req, res) {
        let reqBody = req.body || {};
        let message = [];
        let mandatoryFields = [
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            },
            {
                "key": "role",
                "value": reqBody.role,
                "isMandatory": false
            },
            {
                "key": "start_date",
                "value": reqBody.start_date,
                "isMandatory": false,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "end_date",
                "value": reqBody.end_date,
                "isMandatory": false,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "allocation",
                "value": reqBody.allocation,
                "isMandatory": false,
                "pattern": "^\\d+$"
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let employee_id = reqBody.employee_id;
        let project_id = reqBody.project_id;
        let client_id = reqBody.client_id;
        let toUpdateFields = [
            "role",
            "start_date",
            "end_date",
            "allocation"
        ]
        let mapper_fields = util.getAvailableFields(toUpdateFields, reqBody);
        let updateObj = {};
        let reqBodyFields = Object.keys(mapper_fields);
        reqBodyFields.map(value => {
            updateObj[`projects.$.${value}`] = reqBody[value];
        })
        let startDate = new Date(reqBody.start_date).getTime();
        let endDate = new Date(reqBody.end_date).getTime();
        if(endDate < startDate) {
            message.push("Start date value should be less than the end date");    
            res.send (util.returnResp("Failure", message));
            return;
        }
        if(startDate && endDate) {
            let fmId = reqBody.fmId;
            resource_mapper.updateResourceProjectInfo(employee_id, project_id, client_id, updateObj, fmId)
            .then(data => {
                if(data.status.toLowerCase() === "success" && data.data) {
                    let mailContent = {};
                    //To trigger mail to Functional manager
                    let fmEmail = data.data && data.data.userData[0] && data.data.userData[0].email_id;
                    let fmName = data.data && data.data.userData[0] && data.data.userData[0].name.toUpperCase().replace("|", " ");
                    let rrName = reqBody.rrName && reqBody.rrName.toUpperCase().replace("|", " ");
                    let rName = reqBody.rName && reqBody.rName.toUpperCase().replace("|", " ");
                    let mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.resourceModifyFMNotification;
                    mailContent.toEmail = fmEmail;
                    mailContent.subject = "Reg: Resource Modification Status";
                    mailContent.content = mailBodyContent.replace("<FMName>", fmName).replace("<RRName>", rrName).replace("<RName>", rName).replace("<ProjectName>", project_id);
                    mailContent.toEmail && util.sendMailNotification(mailContent);
                    //To trigger mail to Resource
                    mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.resourceModifyRNotification;
                    mailContent.toEmail = reqBody.rEmail;
                    mailContent.content = mailBodyContent.replace("<RName>",rName).replace("<ProjectName>",project_id).replace("<RRName>", rrName);
                    mailContent.toEmail && util.sendMailNotification(mailContent);
                    delete data.data;
                }
                res.send(data);
            })
            .catch(err => res.send(err)); 
        }
        else {
            message.push("Please enter date in valid format");    
            res.send (util.returnResp("Failure", message));
        }
    },
    viewResourceDaetails(req , res)
    {
        let reqBody = req.body || {};
        let mandatoryFields = [
            { 
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            }
         ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let employee_id = reqBody.employee_id;
        resourceModel.viewResourceDaetails(employee_id)
        .then(data => 
            {
                let objectArr = [];
                if(data && data.status && data.status == "Success")
                {
                    let ressponseData = data && data.status && data.status == "Success" ?  data.message[0] : "";
                    res.status(200).json({data: ressponseData , "status":"Success"});
                }
                else{
                    res.status(200).json({objectArr , "status":"Failure"});
                }
            }
        )
        .catch(err => res.send(err));
    },
    getAllResources(req, res) {
        let reqBody = req.body || {};
        let reqObj = {
            "limit": reqBody.limit || 10,
            "page": reqBody.page || 1,
            "filters": reqBody.filters || []
        }
        resourceModel.getAllResources(reqObj)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    /* this method is for getting resource details from external files */
    getResourceDetails(dbInstance, query) {
        if(query) {
            return resource_mapper.getResourceDetails(dbInstance, query)
            .then(data => data)
            .catch(err => err);
        }
        else {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }
    },
    getpendingstatus(req, res){
        let reqBody = req.body || {};
        let reqObj = {
            "employee_id": reqBody.employee_id || "" 
        };
        let mandatoryFields = [
            {
                "key": "employee_id",
                "value": reqBody.employee_id,
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
        resource_mapper.getPendingStatus(reqObj)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    //Used to get resources associated with given project
    getProjectResources(req, res){
        let reqBody = req.body || {};
        let message = [];
        let mandatoryFields = [
            {
                "key": "client_id",
                "value": reqBody.client_id,
                "isMandatory": true
            },
            {
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true
            },
            {
                "key": "limit",
                "value": reqBody.limit,
                "isMandatory": false,
                "type": "number"
            },
            {
                "key": "page",
                "value": reqBody.page,
                "isMandatory": false,
                "type": "number"
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        else {
            let project_id = reqBody.project_id;
            let reqObj = {
                "limit": reqBody.limit || 10,
                "page": reqBody.page || 1,
                "project_id": reqBody.project_id || "",
                "client_id": reqBody.client_id
            }
            resource_mapper.getProjectResources(reqObj)
            .then(data => 
                {
                    let message = data.message ? data.message : "Success";
                    let status = data.status ? data.status : "Failure";
                    let ressponseData = data.data ? data.data : [];
                    res.status(200).json({data: ressponseData , "status":status, message});
                }
            )
            .catch(err => res.send(err));
        }
    },
    getAvailableResources(req, res) {
        let reqBody = req.body && req.body.filters || {};
        let duration = {};
        let filterObj = {};
        let project_id = req.body.project_id;
        let client_id = req.body.client_id;
        let mandatoryFields = [
            {
                "key": "start_date",
                "value": reqBody.start_date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "end_date",
                "value": reqBody.end_date,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
            },
            {
                "key": "primary_skill",
                "value": reqBody.primary_skill,
                "isMandatory": false,
                "type": "Array"
            },
            {
                "key": "designation",
                "value": reqBody.designation,
                "isMandatory": false
            },
            {
                "key": "limit",
                "value": reqBody.limit,
                "isMandatory": false,
                "type": "number"
            },
            {
                "key": "page",
                "value": reqBody.page,
                "isMandatory": false,
                "type": "number"
            },
            {
                "key": "project_id",
                "value": project_id,
                "isMandatory": false
            },
            {
                "key": "client_id",
                "value": client_id,
                "isMandatory": false
            }
        ];
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        else {
            let reqObj = {
                "limit": req.body.limit || 10,
                "page": req.body.page || 1,
                "project_id": project_id,
                "client_id": client_id
            }
            if(reqBody.designation) {
                filterObj.designation = reqBody.designation;
            }
            if(reqBody.primary_skill) {
                filterObj.primary_skill = { $all: reqBody.primary_skill };
            }
            duration.start_date = reqBody.start_date;
            duration.end_date = reqBody.end_date;
            resource_mapper.getAvailableResources(filterObj, duration, reqObj)
            .then(data => 
                {
                    let message = data.message ? data.message : "Success";
                    let status = data.status ? data.status : "Failure";
                    let ressponseData = data.data ? data.data : [];
                    res.status(200).json({data: ressponseData , "status":status, message});
                }
            )
            .catch(err => res.send(err));
        }
    },
    modifyPendingRequests(req, res)
    {
        let reqBody = req.body || {};
        let message = [];
        let mandatoryFields = [
            { 
                "key": "employee_id",
                "value": reqBody.employee_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            { 
                "key": "project_id",
                "value": reqBody.project_id,
                "isMandatory": true,
            },
            { 
                "key": "functional_manager_id",
                "value": reqBody.functional_manager_id,
                "isMandatory": true,
                "pattern": "^\\d+$"
            },
            { 
                "key": "toCall",
                "value": reqBody.toCall,
                "isMandatory": true
            },
            { 
                "key": "rName",
                "value": reqBody.rName,
                "isMandatory": false
            },
            { 
                "key": "rrEmail",
                "value": reqBody.rrEmail,
                "isMandatory": false
            },
            { 
                "key": "rrName",
                "value": reqBody.rrName,
                "isMandatory": false
            }
        ]
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let reqObj =  {};
        reqObj.project_id = reqBody.project_id;
        reqObj.employee_id = reqBody.employee_id;
        if(reqBody.toCall == "approveRequest")
        {
            resource_mapper.approvePendingRequests(reqObj)
            .then(data => {
                if(data.data && data.status.toLowerCase() === "success"){
                    let mailContent = {};
                    //To trigger mail to resource requestor
                    let fmName = req.session.user.name.toUpperCase().replace("|", " ");
                    let rrName = reqBody.rrName.toUpperCase().replace("|", " ");
                    let mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.resourceApprovedRRNotification;
                    mailContent.toEmail = reqBody.rrEmail;
                    mailContent.subject = "Reg: Resource Allocation Status";
                    mailContent.content = mailBodyContent.replace("<FMName>", fmName).replace("<RRName>",rrName);
                    mailContent.toEmail && util.sendMailNotification(mailContent);
                    //To trigger mail to Resource
                    mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.resourceApprovedRNotification;
                    let rname = reqBody.rName.toUpperCase().replace("|", " ");
                    let projectName = data.data.project_name;
                    let startDate = data.data.start_date;
                    let endDate = data.data.end_date;
                    mailContent.toEmail = data.data.userEmail;
                    mailContent.content = mailBodyContent.replace("<RName>",rname).replace("<ProjectName>",projectName).replace("<StartDate>",startDate).replace("<EndDate>",endDate);
                    mailContent.toEmail && util.sendMailNotification(mailContent);
                }
                res.send(data)
            })
            .catch(err => res.send(err));
        }
        else if(reqBody.toCall == "denyRequest")
        {
            resource_mapper.denyPendingRequests(reqObj)
            .then(data => {
                if(data.status.toLowerCase() === "success" && reqBody.rrEmail){
                    let mailContent = {};
                    //To trigger mail to resource requestor
                    let fmName = req.session.user.name.toUpperCase().replace("|", " ");
                    let rrName = reqBody.rrName.toUpperCase().replace("|", " ");
                    let rName = reqBody.rName.toUpperCase().replace("|", " ");
                    let mailBodyContent = util && util.mailTemplate && util.mailTemplate.dmModule && util.mailTemplate.dmModule.resourceDeclinedRRNotification;
                    mailContent.toEmail = reqBody.rrEmail;
                    mailContent.subject = "Reg: Resource Allocation Status";
                    mailContent.content = mailBodyContent.replace("<FMName>", fmName).replace("<RRName>",rrName).replace("<RName>", rName);
                    util.sendMailNotification(mailContent);
                    res.send(data);
                }
            })
            .catch(err => res.send(err));
        }
        else {
            message.push("There was some error while processing your request");
            res.send(util.returnResp("Failure", message));
            return;
        }
    },
    getResourcecount(req, res)
    {
        let reqBody = req.body || {};
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
        let clientId = reqBody.client_id;
        let projectId = reqBody.project_id; 
        Promise.all([
            resource_mapper.getResourceCount(clientId, projectId),
            projectController.getProjectById(clientId, projectId)
        ])
        .then(data => {
            let resp = data[0] || {};
            if(resp && resp.status && resp.status == "Success") {
                let res_cost_data = data[1] && data[1].data && data[1].data[0] && data[1].data[0].resource_cost ? data[1].data[0].resource_cost : []
                if(res_cost_data.length > 0) {
                    resp.prefilled_data = res_cost_data;
                }
            }
            res.send(resp);
        })
        .catch(err => res.send(err));
    }   
}

module.exports = Resources;