const collectionName = "resources";
const dbUtil = require("./dbUtil");
const util = require('../utils/util');
const DBNAME = "rmt";
const resourceModel = {
    createResource(reqBody) {
        let message = [];
        let email_id = reqBody.email_id;
        let employee_id = reqBody.employee_id;
        let emailQuery = {email_id};
        let employee_id_query = {employee_id};
        let toFind = {$or: [emailQuery, employee_id_query]};
        let toUpdate = {$setOnInsert: reqBody};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            if(reqBody.functional_manager_id && reqBody.functional_manager_name) {
                let leadId = {employee_id : reqBody.functional_manager_id, name: reqBody.functional_manager_name};
                return db.find(leadId).toArray()
                .then(data => {
                    if(data.length > 0) {
                        return this.addResource(db, toFind, toUpdate, message, employee_id, email_id)
                        .then(data => {
                            let obj = {
                                resp: data,
                                db: dbInstance
                            }
                            return obj;
                        })
                        .catch(err => {
                            message.push("There was some error while adding user data");
                            dbInstance.close();
                            return (util.returnResp("Failure", message, err));
                        });
                    }
                    else {
                        message.push("Supervisor Id / Name provided either is invalid or we cannot find any user data with the data provided");
                        dbInstance.close();
                        return (util.returnResp("Failure", message));
                    }
                })
                .catch(err => {
                    message.push("There was some error while getting user data");
                    dbInstance.close();
                    return (util.returnResp("Failure", message, err));
                });
            }
            else {
                return this.addResource(db, toFind, toUpdate, message, employee_id, email_id)
                .then(data => {
                    let obj = {
                        resp: data,
                        message: message,
                        db: dbInstance
                    }
                    return obj;
                })
                .catch(err => {
                    message.push("There was some error while adding user data");
                    dbInstance.close();
                    return (util.returnResp("Failure", message, err));
                });
            }
        })
        .catch(err => {
            message.push("There was some error while connecting to user database");
            return (util.returnResp("Failure", message, err));
        });
    },
    addResource(db, toFind, toUpdate, message, employee_id, email_id) {
        return db.findAndModify(toFind, {}, toUpdate, {upsert: true})
        .then(data => {
            let userData = data.value  || {};
            let existingDataAttribute = "";
            if(userData.email_id && userData.employee_id) {
                let user_email_id = userData.email_id;
                let user_employee_id = userData.employee_id;
                if(email_id == user_email_id) {
                    existingDataAttribute += " Email Id";
                }
                if(employee_id == user_employee_id) {
                    if(existingDataAttribute != "") {
                        existingDataAttribute += ","
                    }
                    existingDataAttribute += " Employee id";
                }
            }
            //dbInstance.close();
            if(data && data.lastErrorObject && data.lastErrorObject.updatedExisting) {
                message.push(`The User Data with this${existingDataAttribute} already exists`);
                return (util.returnResp("Failure", message, data.value));
            }
            else {
                message.push("We have successfully added the Resource Data");
                return (util.returnResp("Success", message));
            }    
        })
        .catch(err => {
            message.push("We are not able to add this Resource at the moment");
            dbInstance.close();
            return (util.returnResp("Failure", message, err));
        });
    },
    updateResource(reqBody, query) {
        let message = [];
        let toFind = query;
        let toUpdate = {$set:reqBody};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db("rmt").collection(collectionName);
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
                message.push("There is no updates in the data");
                return (util.returnResp("Failure", message));                    
            })
            .catch(err => {
                message.push("There was some error while updating user data");
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            message.push("There was some error while connecting to user database");
            return (util.returnResp("Failure", message, err));
        });    
    },
    removeResource(id) {
        let toFind = {employee_id: id}
        let message = [];
        return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.findOneAndDelete(toFind) 
                .then(data => {
                    if(data.lastErrorObject && data.lastErrorObject.n > 0 && data.value) {
                        message.push("We have successfully deleted the Resource Data"); 
                        let obj = {
                            db: dbInstance,
                            message: message,
                            data: data
                        }
                        return obj;
                    }
                    else {
                        dbInstance.close();
                        message.push("Employee id provided is either invalid or we are not able to get any user data for the id provided");
                        return (util.returnResp("Failure", message));
                    }
                })
                .catch(err => {
                    dbInstance.close();
                    message.push("There was some error while deleting user from database");
                    return (util.returnResp("Failure", message, err));
                });
            })
            .catch(err => {
                message.push("There was some error while connecting to user database");
                return (util.returnResp("Failure", message, err));
            });  
    },
    resourceExit(resourceDetailsObj, resourceObj) {
        let message = [];
        let toFind = {employee_id: resourceDetailsObj.employee_id};
        let toUpdate = resourceObj || {};
        return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(collectionName);
                return db.find(toFind).toArray()
                .then(data => {
                    if(data.length > 0) {
                        let userData = data[0];
                        let date = new Date(userData.date_of_joining).getTime();
                        let exitDate = new Date(resourceDetailsObj.date_of_releiving).getTime();
                        if(userData.name.toLowerCase().replace("|"," ") != resourceDetailsObj.employee_name.toLowerCase()) {
                            message.push("Employee name provided does not match the employee name in the record. Please enter the correct employee name of the employee id provided");
                        }
                        if(userData.email_id != resourceDetailsObj.email_id) {
                            message.push("Email id provided does not match the email id in the record. Please enter the correct email id of the employee id provided");
                        }
                        if(userData.department.toLowerCase() != resourceDetailsObj.department.toLowerCase()) {
                            message.push("Department provided does not match the department in the record. Please enter the correct department of the employee id provided");
                        }
                        if(date >= exitDate) {
                            message.push("Exit date cannot be less than the date of joining")
                        }
                        if(message.length > 0) {
                            return (util.returnResp("Failure", message)); 
                        }
                        else {
                            if(userData.in_Notice_Period) {
                                message.push("This user is already in notice period");
                                return (util.returnResp("Failure", message));
                            }
                            else {
                                return db.updateOne(toFind, {$set:toUpdate})
                                .then(data => {
                                    dbInstance.close();
                                    if(data.result && data.result.nModified > 0) {
                                        message.push("We have successfully updated the Resource Exit Data");    
                                        return (util.returnResp("Success", message));
                                    }
                                    else if(data.result && data.result.n > 0) {
                                        message.push("There is no updates in the data");
                                        return (util.returnResp("Failure", message));                        
                                    }
                                })
                                .catch(err => {
                                    message.push("There was some error while updating user exit data");
                                    return (util.returnResp("Failure", message, err));
                                });    
                            }    
                        }
                    }
                    else {
                        message.push("There is no user data found for the employee id / email provided");
                        return (util.returnResp("Failure", message));                        
                    }
                })
                .catch(err => {
                    message.push("There was some error while getting user data database");
                    return (util.returnResp("Failure", message, err));
                });
            })
            .catch(err => {
                message.push("There was some error while connecting to user database");
                return (util.returnResp("Failure", message, err));
            }); 
    },
    viewResourceDaetails(emp_id)
    {
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find({"employee_id":emp_id})
            .project(
                {_id : 0}
            )
            .toArray()
            .then(data => {
                if(data.length > 0) {
                    return (util.returnResp("Success", data));   
                }
                else
                {
                    return (util.returnResp("Failure")); 
                }
            })
            .catch(err => {
                message.push("There was some error while fetching the data");
                return (util.returnResp("Failure", message, err));
            });
        });
    },
    getAllResources(body) {
        var limit = body.limit;
        var pageNumber = body.page;
        var message = [];
        var projectionFields = {
            "name": 1,
            "employee_id": 1,
            "email_id": 1,
            "experience": 1,
            "primary_skill": 1,
            "secondary_skills": 1,
            "designation": 1,
            "department": 1,
            "_id": 0
        }
        var filterObj = {};
        var filters = body.filters && body.filters.length ? body.filters : ""
        if(filters.length) {
            if(filters[0].name) {
                //RMT-14
                let name = new RegExp(filters[0].name.replace(" ","\\|"),'i');
                filters[0].name = {"$regex": name};
            }
            filterObj = { $and: filters };
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
            .project(projectionFields)
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .toArray()
            .then(data => {
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
    }
}
module.exports = resourceModel;