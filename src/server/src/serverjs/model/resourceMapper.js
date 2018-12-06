const collectionName = "resource_mapper";

const dbUtil = require("./dbUtil");
const util = require('../utils/util');
const clientModel = require("../model/clientModel");
const DBNAME = "rmt";

const checkResourceAvalablility = (projects, projectId, startDate, endDate, requestType) => {
    let userProjects = projects || [];
    let allocatedPercentage = 0;
    let message = [];
    let obj = {};
    for(let project of userProjects) {
        if(requestType && requestType == "creation" && project.projectId == projectId) {
            if(project.status == "pending") {
                message.push("Resource cannot be allocated to the project as the user is already allocated to the specified project and is pending for approval");
            }
            else {
                message.push("Resource cannot be allocated to the project as the user is already allocated to the specified project");
            }
            break;
        }
        else {
            if(project.status != "pending") {
                let projectStartDate = new Date(project.start_date).getTime();
                let projectEndDate = new Date(project.end_date).getTime();
                if(projectStartDate && projectEndDate) {
                    if((startDate >= projectStartDate && endDate <= projectEndDate) ||
                    (startDate <= projectStartDate && projectEndDate >= endDate && endDate >= projectStartDate) || 
                    (startDate <= projectStartDate && endDate >= projectEndDate) ||
                    (startDate >= projectStartDate && endDate >= projectEndDate && projectEndDate >= startDate)) {
                        allocatedPercentage += parseInt(project.allocation);
                    }
                }    
            }
        }
    }
    obj.message = message;
    obj.allocatedPercentage = allocatedPercentage;
    return obj;
}
const getEmailIdByEmpId = (emp_id) => {
        let message = [];
        let toFind = {employee_id: emp_id}
        let empData = [];
        let projectionFields = {
            "name": 1,
            "email_id": 1,
            "_id": 0
        }
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find(toFind)
            .project(projectionFields)
            .toArray()
            .then(data => {
                dbInstance.close();
                if(data.length) {
                    empData = data;
                    message.push("Employee data retrived successfully");
                    return({message: message, userData: empData});
                }
                else{
                    message.push("Employee data not found");
                    return({message: message, userData: empData})
                }
            })
            .catch(err=> {
                message.push("Error while getting data");
                return({message: message, userData: empData})
            })
        })
        .catch(err=> {
            message.push("Error while connecting to db");
            return({message: message, userData: empData})
        })
}
const resourceMapper = {
    async createResource(obj) {
        let dbInstance = obj.db || await dbUtil.connectDb();
        let db = dbInstance.db(DBNAME).collection(collectionName);
        let message = obj.message || [];
        let userData = obj.data || {};
        return db.insertOne(userData)
        .then(data => {
            dbInstance.close();
            let insertionObj = data || {};
            if(insertionObj.insertedCount > 0) {
                message.push("We have successfully added the user to mapper");    
                return (util.returnResp("Success", message));
            }
            message.push("There was no data update in the resource mapper");
            return (util.returnResp("Failure", message)); 
        })
        .catch(err => {
            message.push("There was some error while adding user data to mapper");
            return (util.returnResp("Failure", message, err));
        });
    },
    updateResource(reqBody, query) {
        let message = [];
        let toFind = query;
        let toUpdate = {$set: reqBody};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.updateMany(toFind, toUpdate)
            .then(data => {
                dbInstance.close();
                if(data.result) {
                    if(data.result.nModified > 0) {
                        message.push("We have successfully updated the Resource Data");    
                        return (util.returnResp("Success", message));
                    }
                    else if(data.result.n == 0) {
                        message.push("Ther is no user data found for the employee id provided");    
                        return (util.returnResp("Success", message));
                    }
                }
                message.push("There is no updates in the mapper data");
                return (util.returnResp("Failure", message));                    
            })
            .catch(err => {
                message.push("There was some error while updating user mapper data");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to user mapper database");
            return (util.returnResp("Failure", message, err));
        });    
    },
    removeResource(id) {
        let toFind = {employee_id: id}
        let message = [];
        return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.deleteOne(toFind) 
                .then(data => {
                    dbInstance.close();
                    if(data.deletedCount > 0 && data.result && data.result.n > 0) {
                        message.push("We have successfully deleted the mapper Resource Data"); 
                        return util.returnResp("Success", message);
                    }
                    else {
                        message.push("Employee id provided is either invalid or we are not able to get any mapper user data for the id provided");
                        return (util.returnResp("Failure", message));
                    }
                })
                .catch(err => {
                    message.push("There was some error while deleting user from database");
                    return (util.returnResp("Failure", message, err));
                });
            })
            .catch(err => {
                message.push("There was some error while connecting to user database");
                return (util.returnResp("Failure", message, err));
            });  
    },
    allocateProject(resourceId, projectInfo) {
        let message = [];
        let startDate = new Date(projectInfo.start_date).getTime();
        let endDate = new Date(projectInfo.end_date).getTime();
        let toFind = {employee_id: resourceId};
        let clientId = projectInfo.clientId;
        let projectId = projectInfo.projectId; 
        let toAllocate = parseInt(projectInfo.allocation);
        return Promise.all([
            dbUtil.connectDb(),
            clientModel.findProject(clientId, projectId, true)
        ])
        .then(promiseData => {
            let dbInstance = promiseData[0];
            let projectData = promiseData[1] && promiseData[1].data ? promiseData[1].data : {};
            projectInfo.client_name = projectData.client_name;
            projectInfo.project_name = projectData.project_name;
            let clienT_start_date = new Date(projectData.start_date).getTime();
            let clienT_end_date = new Date(projectData.end_date).getTime();
            if(startDate < clienT_start_date) {
                message.push("Resource start date cannot be greater than project start date");
            } 
            if(endDate > clienT_end_date) {
                message.push("Resource end date cannot be greater than project end date");
            } 
            if(message.length > 0) {
                return (util.returnResp("Failure", message));
            }
            if(projectInfo.project_name && projectInfo.client_name) {
                let toUpdate = {$push: {"projects": projectInfo}};
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.find(toFind).toArray()
                .then(data => {
                    let userData = data[0];
                    if(data.length > 0) {
                        let userProjects = userData.projects || [];
                        let obj = checkResourceAvalablility(userProjects,projectId, startDate, endDate, "creation");
                        if(obj.message.length > 0) {
                            dbInstance.close();
                            return (util.returnResp("Failure", obj.message));
                        }
                        if(obj.allocatedPercentage == 0 || (obj.allocatedPercentage + toAllocate) <= 100) {
                            return db.updateOne(toFind, toUpdate)
                            .then(data => {
                                dbInstance.close();
                                if(data.result && data.result.n && data.result.n > 0 && data.result.nModified && data.result.nModified > 0) {
                                    let managerId = userData.functional_manager_id ? userData.functional_manager_id : "";
                                    return getEmailIdByEmpId(managerId)
                                    .then(empDetails => {
                                        message.push("This resource will be allocated to the project once manager of the resource approves"); 
                                        return util.returnResp("Success", message, empDetails);
                                    })
                                }
                                else {
                                    message.push("There was no update to make");
                                    return (util.returnResp("Failure", message));
                                }
                            })
                            .catch(err => {
                                dbInstance.close();
                                message.push("There was some error while allocating user to project");
                                return (util.returnResp("Failure", message, err));
                            });
                        }
                        else if((obj.allocatedPercentage + toAllocate) > 100){
                            dbInstance.close();
                            message.push("Resource cannot be allocated to the project as the user is already allocated 100% to the projects");
                            return (util.returnResp("Failure", message));
                        }
                        else {
                            dbInstance.close();
                            message.push("Resource cannot be allocated to the project as the user is not available during the period specified");
                            return (util.returnResp("Failure", message));
                        }
                    }
                    else {
                        dbInstance.close();
                        message.push(`The employee id provided is either invalid or there is no record for the employee id provided`);
                        return (util.returnResp("Failure", message));
                    }
                })
                .catch(err => {
                    dbInstance.close();
                    message.push("There was some error while updating user mapper data");
                    return (util.returnResp("Failure", message, err));
                });    
            }
            else {
                dbInstance.close();
                message.push("Project id/ Client id provided is either invalid or we are not able to get any mapper project data for the id provided");
                return (util.returnResp("Failure", message));
            }
        })
        .catch(err => {
            message.push("There was some error while connecting to user mapper database");
            return (util.returnResp("Failure", message, err));
        });   
    },
    releaseFromProject(employee_id, project_id, client_id, managerId) {
        let message = [];
        let toFind = {employee_id};
        let toUpdate = {$pull: {projects: {clientId: client_id, projectId: project_id}}};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.updateOne(toFind, toUpdate)
            .then(data => {
                dbInstance.close();
                if(data.result && data.result.nModified > 0) {
                    message.push("We have successfully removed the Resource from project");
                    if(managerId) {
                        return getEmailIdByEmpId(managerId)
                          .then(empDetails => {
                            return (util.returnResp("Success", message, empDetails));
                        })
                    }
                    else {
                        return (util.returnResp("Success", message));
                    }
                }
                message.push("There is no updates in the data");
                return (util.returnResp("Failure", message));                    
            })
            .catch(err => {
                message.push("There was some error while updating user mapper data");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to user mapper database");
            return (util.returnResp("Failure", message, err));
        });
    },
    updateResourceProjectInfo(employee_id, project_id, client_id, mapper_fields, managerId) {
        let message = [];
        let toFind = {employee_id, "projects.projectId": project_id, "projects.clientId": client_id};
        let toUpdate = {$set: mapper_fields};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            if("projects.$.start_date" in mapper_fields || "projects.$.end_date" in mapper_fields || "projects.$.allocation" in mapper_fields) {
                return db.find(toFind).toArray()
                .then(data => {
                    if(data.length > 0) {
                        let userData = data[0];
                        let userProjects = userData.projects || [];
                        let userAllocatedProject = userProjects.filter(project => project.projectId == project_id);
                        let startDate = mapper_fields["projects.$.start_date"] ? new Date(mapper_fields["projects.$.start_date"]).getTime() : userAllocatedProject[0].start_date;
                        let endDate = mapper_fields["projects.$.end_date"] ? new Date(mapper_fields["projects.$.end_date"]).getTime() : userAllocatedProject[0].end_date;
                        if(endDate < startDate) {
                            message.push("Start date value should be less than the end date");
                            return (util.returnResp("Failure", message));
                        }
                        let toAllocate = mapper_fields["projects.$.allocation"] ? parseInt(mapper_fields["projects.$.allocation"]) : userAllocatedProject[0].allocation;
                        let obj = checkResourceAvalablility(userProjects, project_id, startDate, endDate, "updation");
                        if(obj.message.length > 0) {
                            dbInstance.close();
                            return (util.returnResp("Failure", obj.message));
                        }
                        if(obj.allocatedPercentage == 0 || (obj.allocatedPercentage + toAllocate) <= 100) {
                            return db.updateOne(toFind, toUpdate)
                            .then(data => {
                                dbInstance.close();
                                if(data.result && data.result.n && data.result.n > 0 && data.result.nModified && data.result.nModified > 0) {
                                    message.push("We have successfully updated the project Data of resource"); 
                                    if(managerId) {
                                        return getEmailIdByEmpId(managerId)
                                        .then(empDetails => {
                                            return util.returnResp("Success", message, empDetails);
                                        })
                                    }
                                    else {
                                        return util.returnResp("Success", message);
                                    }
                                }
                                else {
                                    message.push("There was no update to make");
                                    return (util.returnResp("Failure", message));
                                }
                            })
                            .catch(err => {
                                dbInstance.close();
                                message.push("There was some error while updating project info");
                                return (util.returnResp("Failure", message, err));
                            });
                        }
                        else if((obj.allocatedPercentage + toAllocate) > 100){
                            dbInstance.close();
                            message.push("Resource cannot be allocated to the project as the user is already allocated 100% to the projects");
                            return (util.returnResp("Failure", message));
                        }
                        else {
                            dbInstance.close();
                            message.push("Resource cannot be allocated to the project as the user is not available during the period specified");
                            return (util.returnResp("Failure", message));
                        }
                    }
                    else {
                        dbInstance.close();
                        message.push(`The employee id provided is either invalid or there is no record for the employee id provided`);
                        return (util.returnResp("Failure", message));
                    }

                })     
                .catch(err => {
                    console.log(err);
                    message.push("There was some error while getting user mapper data");
                    return (util.returnResp("Failure", message, err));
                });                   
            }
            else {
                return db.updateOne(toFind, toUpdate)
                .then(data => {
                    console.log(data);
                    dbInstance.close();
                    if(data.result && data.result.nModified > 0) {
                        message.push("We have successfully updated the Resource from project");    
                        return (util.returnResp("Success", message));
                    }
                    message.push("There is no updates in the data");
                    return (util.returnResp("Failure", message));                    
                })
                .catch(err => {
                    console.log(err);
                    message.push("There was some error while updating user mapper data");
                    return (util.returnResp("Failure", message, err));
                });
            }
        })
    },
    async getResourceDetails(dbIns, query , projectionFields) {
        let dbInstance = dbIns || await dbUtil.connectDb();
        let db = dbInstance.db(DBNAME).collection(collectionName);
        return db.find(query).project(projectionFields).toArray()
        .then(data => data)
        .catch(err => err);
    },
    getPendingStatus(body)
    {
        if(body)
        {
            let functional_manager_id = body.employee_id;
            let toFind = {functional_manager_id, "projects.status": "pending"};
            return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.find(toFind).toArray()
                .then(data => {
                    dbInstance.close();
                    if(data.length > 0) {
                        let responseData = data;
                        let wholeData = [];
                        let responseDataLen = responseData.length;
                        for(let i=0 ; i< responseDataLen; i++)
                        {
                            let resourceInfo = {};
                            resourceInfo.name = responseData[i].name && responseData[i].name.indexOf("|") >=0 ? responseData[i].name.replace("|", " ") : responseData[i].name;
                            resourceInfo.designation = responseData[i].designation ? responseData[i].designation : "NA";
                            resourceInfo.employee_id = responseData[i].employee_id ? responseData[i].employee_id : "NA";
                            if(data[i].projects)
                            {
                                let pendingData = data[i].projects.filter(project => project.status == "pending");
                                if(pendingData && pendingData.length)
                                {
                                    resourceInfo.pendingData = pendingData;
                                }
                            }
                            wholeData.push(resourceInfo);
                        }
                        return (util.returnResp("Success", "Pending status have been displayed" ,wholeData));
                    }
                    else
                    {
                       return (util.returnResp("Failure", "No Data Found" ,data));
                    }
                })
            })
        }
    },
    getProjectResources(data) {
        let message = [];
        var projectionFields = {
            "_id": 0
        }
        let proj_id = data.project_id;
        let clientId = data.client_id;
        let limit = data.limit;
        let pageNumber = data.page;
        if(proj_id) {
            let toFind = {projects:{$elemMatch:{$and: [{clientId},{projectId: proj_id}, {status: "approved"}]}}};
            let projectResources = [];
            return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                var totalNoOfRecords = 0;
                var findQuery = db.find(toFind);
                findQuery
                .count()
                .then(count => {
                    totalNoOfRecords = count;
                })
                return findQuery
                .project(projectionFields)
                .limit(limit)
                .skip((pageNumber - 1) * limit)
                .toArray()
                .then(data => {
                    dbInstance.close();
                    if(data.length) {
                        data.map(resource => {
                            if(resource.projects.length) {
                                let userProjects = resource.projects;
                                resource.projects = userProjects.filter(project => (project.projectId === proj_id));
                                let projectInfo = userProjects ? userProjects[0] : {};
                                let startDate = new Date(projectInfo.start_date).getTime();
                                let endDate = new Date(projectInfo.end_date).getTime();
                                let obj = checkResourceAvalablility(userProjects, null, startDate, endDate, null);
                                if(obj.message.length > 0) {
                                    dbInstance.close();
                                    return (util.returnResp("Failure", obj.message));
                                }
                                resource.availablePercentage = 0;
                                if(obj.allocatedPercentage >= 0 && obj.allocatedPercentage <= 100) {
                                    resource.availablePercentage = (100 - obj.allocatedPercentage);
                                }
                                if(resource.projects.length) {
                                    projectResources.push(resource);
                                }
                            }
                        })
                        if(projectResources.length) {
                            let data = {"pagination": {"total": totalNoOfRecords, "limit": limit, "page": pageNumber}, projectResources}
                            message.push("User data retrived successfully");
                            return (util.returnResp("Success", message, data));
                        }
                        else {
                            message.push("No records found");
                            return (util.returnResp("Success", message, projectResources));
                        }
                    }
                    else
                    {
                        message.push("No records found");
                        return (util.returnResp("Success", message, data));
                    }
                })
                .catch(err => {
                    message.push("There was an error while fetching data");
                    return (util.returnResp("Failure", message));
                })
            })
            .catch(err => {
                message.push("There was an error while conneting DB");
                return (util.returnResp("Failure", message));
            })
        }
    },
    getAvailableResources(filters, duration, body) {
        let message = [];
        let projectionFields = {
            "_id": 0
        };
        var limit = body.limit;
        var pageNumber = body.page;
        let availableResources = [];
        let allocatedPercentage = 0;
        let startDate = new Date(duration.start_date).getTime();
        let endDate = new Date(duration.end_date).getTime();
        let toFind = {};
        if(filters) {
            toFind = filters;
        }
        //toFind.projects = {start_Date: duration.start_date, end_Date: duration.end_date};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            var totalNoOfRecords = 0;
            var findQuery = db.find(toFind);
            findQuery
            .count()
            .then(count => {
                totalNoOfRecords = count;
            })
            return findQuery
            .project(projectionFields)
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .toArray()
            .then(data => {
                dbInstance.close();
                if(data.length > 0) {
                    data.map(resource => {
                        obj = checkResourceAvalablility(resource.projects,null, startDate, endDate, null);
                        allocatedPercentage = obj.allocatedPercentage;
                        if(allocatedPercentage < 100) {
                            if(body.project_id && body.client_id) {
                                let userProjects = resource.projects;
                                resource.projects = userProjects.filter(project => (project.projectId === body.project_id && project.clientId === body.client_id))
                                let isApproved = false;
                                let isPending = false;
                                resource.projects.length && resource.projects.map(project => {
                                    if(project.status.toLowerCase() === "approved") {
                                        isApproved = true;
                                    }
                                    else {
                                        isPending = true;
                                    }
                                })
                                !isPending && delete resource.projects;
                                resource.availablePercentage = (100 - allocatedPercentage);
                                !isApproved && availableResources.push(resource);
                            }
                            else {
                                delete resource.projects;
                                resource.availablePercentage = (100 - allocatedPercentage);
                                availableResources.push(resource);
                            }
                        }
                    })
                    if(availableResources.length) {
                        let data = {"pagination": {"total": totalNoOfRecords, "limit": limit, "page": pageNumber}, availableResources}
                        message.push("User data retrived successfully");
                        return (util.returnResp("Success", message, data));
                    }
                    else {
                        message.push("No Records found in the given timespan");
                        return (util.returnResp("Success", message, availableResources));
                    }
                }
                else {
                    message.push("No records found");
                    return (util.returnResp("Success", message, data));
                }
            })
            .catch(err => {
                message.push("There was an error while fetching data");
                return (util.returnResp("Failure", message));
            })
        })
        .catch(err => {
            message.push("There was an error while conneting DB");
            return (util.returnResp("Failure", message));
        })
    },
    approvePendingRequests(body)
    {
        if(body)
        {
            let employee_id = body.employee_id;
            let message = [];
            let toFind = {employee_id , "projects.projectId": body.project_id};
            console.log(toFind);
            return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.find({employee_id}).toArray()
                .then(data => {
                    if(data.length > 0) {
                        let userData = data[0];
                        let userEmail = userData.email_id;
                        let projects = userData.projects || [];
                        let projectId = body.project_id;
                        let projectData = projects.filter(project => project.projectId == projectId);
                        if(projectData.length > 0) {
                            let projectInfo = projectData[0];
                            let start_date = new Date(projectInfo.start_date).getTime();
                            let end_date = new Date(projectInfo.end_date).getTime(); 
                            let toAllocate = parseInt(projectInfo.allocation);
                            let obj = checkResourceAvalablility(projects, null, start_date, end_date, null);
                            if(obj.message.length > 0) {
                                dbInstance.close();
                                return (util.returnResp("Failure", obj.message));
                            }
                            if(obj.allocatedPercentage == 0 || (obj.allocatedPercentage + toAllocate) <= 100) {
                                return db.updateOne(toFind ,  { $set: {"projects.$.status" : "approved"}})
                                .then(data => {
                                    dbInstance.close();
                                    if(data.result && data.result.nModified > 0)
                                    {
                                        message.push("We have successfully Added the Resource to the Respective Project");
                                        projectInfo.userEmail = userEmail;    
                                        return (util.returnResp("Success", message, projectInfo));
                                    }
                                    else
                                    {
                                        message.push("There is no updates in the mapper data");
                                        return (util.returnResp("Failure", message));              
                                    }
                                })
                                .catch(err => {
                                    message.push("There was some error while updating user mapper data");
                                    return (util.returnResp("Failure", message, err));
                                });
                            }
                            else if((obj.allocatedPercentage + toAllocate) > 100){
                                dbInstance.close();
                                message.push("Resource cannot be allocated to the project as the user is already allocated 100% to the projects");
                                return (util.returnResp("Failure", message));
                            }
                            else {
                                dbInstance.close();
                                message.push("Resource cannot be allocated to the project as the user is not available during the period specified");
                                return (util.returnResp("Failure", message));
                            }
                        }
                        else {
                            dbInstance.close();
                            message.push(`Project id provided is either invalid or there is no record for the project id provided`);
                            return (util.returnResp("Failure", message));    
                        }
                    }
                    else {
                        dbInstance.close();
                        message.push(`The employee id provided is either invalid or there is no record for the employee id provided`);
                        return (util.returnResp("Failure", message));
                    }
            })
                .catch(err => {
                    dbInstance.close();
                    message.push("There was some error while updating user mapper data");
                    return (util.returnResp("Failure", message, err));
                });                 
            })
        }
    },
    denyPendingRequests(body)
    {
        if(body)
        {
            let employee_id = body.employee_id;
            let message = [];
            let toFind = {employee_id };
            return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.updateOne(toFind ,  { $pull: {"projects" : {"projectId": body.project_id}}})
                .then(data => {
                    dbInstance.close();
                    if(data.result && data.result.nModified > 0)
                    {
                        message.push("We have successfully Removed the Resource from the Respective Project");    
                        return (util.returnResp("Success", message));
                    }
                    else
                    {
                        message.push("There is no updates in the mapper data");
                        return (util.returnResp("Failure", message));              
                    }
                })
                .catch(err => {
                    message.push("There was some error while updating user mapper data");
                    return (util.returnResp("Failure", message, err));
                });
            })
        }
    },
    getResourceCount(clientId, projectId)
    {
        if(clientId && projectId)
        {
            let message = [];
            let toFind = {projects:{$elemMatch: {$and: [{projectId,clientId}]}}};
            var projectionFields = {    
                "_id": 0,
                "designation":1,
                "employee_id":1,
                "projects":1
             }
            return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.find(toFind)
                .project(projectionFields)
                .toArray()
                .then(data => {
                    dbInstance.close();
                    if(data.length > 0) {
                        let dataLen = data.length;
                        let responseData = data;
                        let resCountArr = [];
                        for(let i=0 ; i<dataLen ;i++)
                        {
                            if(responseData[i] && responseData[i].projects)
                            {
                                let projectData = responseData[i].projects;
                                let projectLength = projectData.length;
                                for(let j=0 ; j<projectLength ; j++)
                                {
                                    if(projectData[j].projectId == projectId && projectData[j].status != "pending") {
                                        responseData[i].role = projectData[j].role;
                                        delete(responseData[i].projects);
                                        resCountArr.push(responseData[i]);
                                    }
                                }
                            }
                        }
                        message.push("Resource Count has been Shown Successfully.");    
                        return (util.returnResp("Success", message,resCountArr));
                    }
                    else {
                        message.push("There is no Resource found for the client / project id provided");    
                        return (util.returnResp("Failure", message));
                    }
                })
            })
        }
    }
}
module.exports = resourceMapper;