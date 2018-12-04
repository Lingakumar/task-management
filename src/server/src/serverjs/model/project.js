const collectionName = "project";

const dbUtil = require("./dbUtil");
const util = require('../utils/util');
const DBNAME = "rmt";

const Project = {
    addProjectToClient(clientId, projectObj) {
        let toFind = {client_id: clientId};
        let toUpdate = {$addToSet: {projects: projectObj}};
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find(toFind).toArray()
            .then(data => {
                if(data && data.length > 0) {
                    data[0].projects.map(value => {
                        if(value.project_id == projectObj.project_id) {
                            message.push("The sub project id provided already exists");    
                        }  
                        if(value.project_name == projectObj.project_name) {
                            message.push("The sub project name provided already exists");
                        }
                    });
                    if(message.length > 0) {
                        dbInstance.close();
                        return (util.returnResp("Failure", message));
                    }
                    else {
                        return db.updateOne(toFind,toUpdate)
                        .then(data => {
                            dbInstance.close();
                            message.push("The sub project data is added to project succcessfully");
                            return (util.returnResp("Success", message));
                        })
                        .catch(err => {
                            dbInstance.close();
                            message.push("There was some error while updating project database");
                            return (util.returnResp("Failure", message, err));
                        });    
                    }
                }
                else {
                    dbInstance.close();
                    message.push("The project id provided is not valid or project id entered does not exist");
                    return (util.returnResp("Failure", message));
                }
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while getting project data");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });
    },
    removeProjectFromClient(clientId, projectId) {
        let toFind = {client_id: clientId};
        let toUpdate = {$pull: {projects: {project_id: projectId}}};
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find(toFind).toArray()
            .then(data => {
                if(data && data.length > 0) {
                    let subprojectAvailability = false;
                    data[0].projects.map(value => {
                        if(value.project_id == projectId) {
                            subprojectAvailability = true;    
                        }
                    });
                    if(!subprojectAvailability) {
                        dbInstance.close();
                        message.push("The sub project id provided is either invalid or the sub project with the given id does not exist");
                        return (util.returnResp("Failure", message));
                    }
                    else {
                        return db.updateOne(toFind,toUpdate)
                        .then(data => {
                            dbInstance.close();
                            if(data.modifiedCount > 0) {
                                message.push("The sub project data is removed from project succcessfully");
                                return (util.returnResp("Success", message));    
                            }
                            else {
                                message.push("The sub project data cannot be removed from project at this moment");
                                return (util.returnResp("Failure", message));    
                            }
                        })
                        .catch(err => {
                            dbInstance.close();
                            message.push("There was some error while updating project database");
                            return (util.returnResp("Failure", message, err));
                        });    
                    }
                }
                else {
                    dbInstance.close();
                    message.push("The project id provided is not valid or project with the id entered does not exist");
                    return (util.returnResp("Failure", message));
                }
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while getting project data");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });
    },
    updateProjectData(clientId, projectId, toUpdate) {
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            let toFind = {"client_id": clientId};
            return db.find(toFind).toArray()
            .then(data => {
                if(data && data.length > 0) {
                    let subprojectAvailability = false;
                    data[0].projects.map(value => {
                        if(value.project_id == projectId) {
                            subprojectAvailability = true;    
                        }
                    });
                    if(!subprojectAvailability) {
                        dbInstance.close();
                        message.push("The sub project id provided is either invalid or the sub project with the given id does not exist");
                        return (util.returnResp("Failure", message));
                    }
                    else {
                        let subprojectQuery = {"client_id": clientId, "projects.project_id": projectId}
                        return db.updateOne(subprojectQuery, {$set:toUpdate})
                        .then(data => {
                            dbInstance.close();
                            if(data.result && data.result.nModified > 0) {
                                message.push("We have successfully updated the project Data");    
                                return (util.returnResp("Success", message));
                            }
                            message.push("There is no updates in the data");
                            return (util.returnResp("Failure", message));                    
                        })
                        .catch(err => {
                            message.push("There was some error while updating project data");
                            return (util.returnResp("Failure", message, err));
                        });    
                    }
                }
                else {
                    dbInstance.close();
                    message.push("The project id provided is not valid or project with the id entered does not exist");
                    return (util.returnResp("Failure", message));
                }
            })
            .catch(err => {
                dbInstance.close();
                message.push("There was some error while getting project data");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to project database");
            return (util.returnResp("Failure", message, err));
        });
    }
}

module.exports = Project;