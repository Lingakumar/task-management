const collectionName = "project";
const DBNAME = "rmt";
const dbUtil = require("./dbUtil");
const util = require('../utils/util');

const getIdentifiers = (db) => {
    let id = util.getRandomNumber(5);
    toFind = {id: id}
    return db.find(toFind).toArray()
    .then(data => {
        if(data && data.length == 0) {
            return id;
        }
        else {
            getIdentifiers(db);
        }
    })
    .catch(err => {
        console.log(err);
        return 0;
    })
}

const Client = {
    createNewProject(projectObj) {
        let projectName = projectObj.client_name || "";
        let toFind = {client_name: projectName};
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return getIdentifiers(db)
            .then(id => {
                id = projectName.slice(0,3) + id;
                projectObj.client_id = id;
                return db.findAndModify(toFind, {}, {$setOnInsert: projectObj}, {upsert: true})
                .then(data => {
                    dbInstance.close();
                    if(data && data.lastErrorObject && data.lastErrorObject.updatedExisting) {
                        message.push("The project with this name already exists");
                        return (util.returnResp("Failure", message, data.value));
                    }
                    else {
                        let successData = {
                            client_id: id
                        }
                        message.push("We have successfully added the project");
                        return (util.returnResp("Success", message, successData));
                    }
                })
                .catch(err => {
                    dbInstance.close();
                    message.push("We are not able to add this project at the moment");
                    return (util.returnResp("Failure", message, err));
                });
            })
            .catch(err => {
                dbInstance.close();
                let message = "Cannot get the identifier for the project";
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            let message = "There was some error while connecting to project database";
            return (util.returnResp("Failure", message, err));
        });  
    },
    deleteProject(projectId) {
        let toFind = {client_id: projectId};
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.deleteOne(toFind)
            .then(data => {
                dbInstance.close();
                if(data) {
                    if(data.deletedCount > 0) {
                        message.push("Project was deleted successfully");
                        return (util.returnResp("Success", message));
                    }
                    else if(data.result && data.result.n == 0) {
                        message.push("The project id provided is either invalid or there is no project with the id specified");
                        return (util.returnResp("Failure", message));
                    }    
                    else {
                        message.push("We are not able to delete the project at this moment");
                        return (util.returnResp("Failure", message));
                    }
                }
                else {
                    message.push("We are not able to delete the project at this moment");
                    return (util.returnResp("Failure", message));
                }
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while tryig to delete the project from database");
                return (util.returnResp("Failure", message, err));
            });    
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });    
    },
    findProject(clientId, projectId, getClients) {
        let message = [];
        let toFind = {client_id: clientId, "projects.project_id": projectId}
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find(toFind).toArray()
            .then(data => {
                if(data.length > 0) {
                    let clientData = data[0];
                    let project = clientData.projects.filter(project => project.project_id == projectId);
                    let obj;
                    if(getClients) {
                        obj = {
                            client_name: clientData.client_name,
                            project_name: project[0].project_name,
                            start_date: project[0].start_Date,
                            end_date: project[0].end_Date
                        }
                        dbInstance.close();
                        message.push("Project data is found succcessfully");
                        return (util.returnResp("Success", message, obj));
                    }
                    else {
                        obj = {
                            projectData : project[0],
                            db: db,
                            dbInstance: dbInstance
                        }
                        return obj;
                    }             
                }
                else {
                    dbInstance.close();
                    message.push("Project id/ Client id provided is either invalid or we are not able to get any mapper project data for the id provided");
                    return (util.returnResp("Failure", message));
                }
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while trying to find the project from database");
                return (util.returnResp("Failure", message, err));
            });    
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });  
    },
    addResourceCost(clientId, projectId, resourceCost) {
        let message = [];
        let toFind = {client_id: clientId, "projects.project_id": projectId};
        let toUpdate = {$set: {"projects.$.resource_cost": resourceCost}};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.updateOne(toFind, toUpdate)
            .then(data => {
                dbInstance.close();
                if(data.result && data.result.nModified > 0) {
                    message.push("We have successfully added the project resource cost Data");    
                    return (util.returnResp("Success", message));
                }
                else if(data.result && data.result.n == 0) {
                    message.push("The project data is empty for the project / client id provided");    
                    return (util.returnResp("Failure", message));
                }
                message.push("There is no updates in the data");
                return (util.returnResp("Failure", message)); 
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while trying to updating the project data");
                return (util.returnResp("Failure", message, err));
            });    
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });  
    },
    updateResourceCost(clientId, projectId, resourceCost) {
        let message = [];
        let toFind = {client_id: clientId, "projects.project_id": projectId};
        return this.findProject(clientId, projectId, false)
        .then(obj => {
            let db = obj.db;
            let projectData = obj.projectData || {};
            let updatedResourceCost;
            if(projectData.resource_cost) {
                projectData.resource_cost.map(resourceCostData => {
                    let cost = resourceCost.get(resourceCostData.role);
                    if(cost) {
                        resourceCostData.resource_cost = cost;
                        resourceCost.delete(resourceCostData.role);
                    }
                })
            }
            updatedResourceCost = projectData.resource_cost;
            if(resourceCost.size > 0) {
                resourceCost.forEach((value, key) => {
                    let obj = {
                        role: key,
                        resource_cost: value
                    }
                    updatedResourceCost.push(obj);
                })
            }
            let toUpdate = {$set: {"projects.$.resource_cost": updatedResourceCost}};
            return db.updateOne(toFind, toUpdate)
            .then(data => {
                obj.dbInstance.close();
                if(data.result && data.result.nModified > 0) {
                    message.push("We have successfully updated the project resource cost Data");    
                    return (util.returnResp("Success", message));
                }
                else if(data.result && data.result.n == 0) {
                    message.push("The project data is empty for the project / client id provided");    
                    return (util.returnResp("Failure", message));
                }
                message.push("There is no updates in the data");
                return (util.returnResp("Failure", message)); 
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while trying to updating the project data");
                return (util.returnResp("Failure", message, err));
            });    
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });  
    },
    getAllProjects(body) {
        var limit = body.limit;
        var pageNumber = body.page;
        var emp_id = body.employee_id;
        var message = [];
        var filterObj = {};
        var filters = body.filters && body.filters.length ? body.filters : "";
        var proj_name = filters && filters[0].project_name;
        if(filters.length) {
            if(filters[0].project_name) {
                filters[0].project_name = {"$regex": new RegExp(filters[0].project_name, 'i')};
            }
            filterObj = {projects:{$elemMatch:{ owner_id: emp_id, $and: filters }}};
        }
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            var totalNoOfRecords = 0;
            var findQuery = db.find(filterObj);
            findQuery
            .count()
            .then(count => {
                totalNoOfRecords = count;
            })
            return findQuery
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .toArray()
            .then(data => {
                if(data.length && data[0] && data[0].projects && data[0].projects.length > 1 && ((body.filters && body.filters && body.filters[0] && body.filters[0].project_id) || proj_name)) {
                    data[0].projects = data[0].projects.filter(project => (project.owner_id === emp_id && (proj_name && project.project_name.indexOf(proj_name) != -1 || body.filters[0].project_id && project.project_id.indexOf(body.filters[0].project_id) != -1)))
                }
                else {
                    data[0].projects = data[0].projects.filter(project => (project.owner_id === emp_id));
                }
                let dataObj = {"pagination": {"total": totalNoOfRecords, "limit": limit, "page": pageNumber}, "data": data};
                return (util.returnResp("Success", dataObj));
            })
            .catch(err => {
                message.push("There was some error while fetching the data");
                return (util.returnResp("Failure", message, err));
            })
        })
        .catch(err=> {
            console.log(err);
        }) 
    },
    getProjectInfo(reqBody) {
        let clientId = reqBody.client_id || "";
        let projectId = reqBody.project_id || ""; 
        let toFind = {client_id: clientId};
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find(toFind).toArray()
            .then(data => {
                dbInstance.close();
                if(data.length > 0) {
                    let clientData = data[0];
                    let projectData = [];
                    if(projectId) {
                        let projects = clientData.projects || [];
                        if(projects.length > 0) {
                            projectData = projects.filter(project => project.project_id == projectId);
                            clientData.subProjects = projectData || [];
                            clientData.subProjects[0].client_name = clientData.client_name ? clientData.client_name : "";
                            if(projectData.length == 0) {
                                message.push("Project Id provided is either invalid or the project data doesnot exist for the given project id");
                            }
                        }
                        else {
                            message.push("We are not able to get the project data for the id provided");
                        }
                    }
                    message.push("The project list was listed successfully");
                    return (util.returnResp("Success", message, clientData.subProjects));
                }
                else {
                    message.push("The project id provided is either not valid or data for project id entered does not exist");
                    return (util.returnResp("Failure", message));
                }
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while getting project data list");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        }); 
    }
}

module.exports = Client;