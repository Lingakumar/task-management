const collectionName = "resources_admin";
const dbUtil = require("./dbUtil");
const util = require('../utils/util');
const resourceController = require("../controller/resource.js");
const main_controller = require("../controller/main_controller");
const DBNAME = "rmt";

const UserAdminModel = {
    activateAccount(email_id, access_level) {
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            let query = {email_id};
            return resourceController.getResourceDetails(dbInstance, query)
            .then(data => {
                if(data.length > 0) {
                    let userData = data[0];
                    let privelageKeys = [];
                    if(access_level.length > 0) {
                        privelageKeys = main_controller.checkPrivelageKeys(access_level);
                    }
                    let userObj = {
                        name: userData.name || "",
                        email_id,
                        employee_id: userData.employee_id || "",
                        password: "skava123",
                        designation: userData.designation || "",
                        privelage_level: privelageKeys
                    }
                    return db.findOneAndUpdate(query, {$set:userObj}, {upsert: true})
                    .then(data => {
                        dbInstance.close();
                        if(data && data.lastErrorObject && data.lastErrorObject.updatedExisting) {
                            message.push("The User Data with this emailId already exists");
                            return (util.returnResp("Failure", message, data.value));
                        }
                        else {
                            message.push("We have successfully added the Resource as the admin");
                            return (util.returnResp("Success", message));
                        } 
                    })
                    .catch(err => {
                        message.push("There was some error while adding user as admin");
                        dbInstance.close();
                        return (util.returnResp("Failure", message, err));
                    });
                }
                else {
                    dbInstance.close();
                    message.push("There is no user data found for the email id provided");
                    return (util.returnResp("Failure", message)); 
                }
            })
            .catch(err => {
                message.push("We are not able to get this Resource details at the moment");
                dbInstance.close();
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            dbInstance.close();
            message.push("There was some error while connecting to user database");
            return (util.returnResp("Failure", message, err));
        });
    },
    deActivateAccount(email_id) {
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            let query = {email_id};
            return resourceController.getResourceDetails(dbInstance, query)
            .then(data => {
                if(data.length > 0) {
                    return db.findOneAndDelete(query)
                    .then(data => {
                        dbInstance.close();
                        if(data.lastErrorObject && data.lastErrorObject.n > 0 && data.value) {
                            message.push("We have successfully deactivated the account for the resource"); 
                            return (util.returnResp("Success", message));
                        }
                        else {
                            message.push("Employee id provided is either invalid or we are not able to get any user data for the id provided");
                            return (util.returnResp("Failure", message));
                        }
                    })
                    .catch(err => {
                        message.push("There was some error while removing user as admin");
                        dbInstance.close();
                        return (util.returnResp("Failure", message, err));
                    });
                }
                else {
                    dbInstance.close();
                    message.push("There is no user data found for the email id provided");
                    return (util.returnResp("Failure", message)); 
                }
            })
            .catch(err => {
                message.push("We are not able to get this Resource details at the moment");
                dbInstance.close();
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            dbInstance.close();
            message.push("There was some error while connecting to user database");
            return (util.returnResp("Failure", message, err));
        });
    },
    addPrivelage(email_id, access_level) {
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            let query = {email_id};
            return db.find(query).toArray()
            .then(data => {
                if(data.length > 0) {
                    let privelageKeys = [];
                    if(access_level.length > 0) {
                        privelageKeys = main_controller.checkPrivelageKeys(access_level);
                    }
                    let toUpdate = { $addToSet: { "privelage_level": {$each: privelageKeys } } };
                    return db.updateOne(query, toUpdate)
                    .then(data => {
                        dbInstance.close();
                        if(data.result && data.result.nModified > 0) {
                            message.push("We have successfully added the privelage to user");    
                            return (util.returnResp("Success", message));
                        }
                        message.push("There is no updates in the privelage");
                        return (util.returnResp("Failure", message));                    
                    })
                    .catch(err => {
                        message.push("There was some error while adding privelage to user");
                        return (util.returnResp("Failure", message, err));
                    });
                }
                else {
                    dbInstance.close();
                    message.push("There is no user data found for the email id provided");
                    return (util.returnResp("Failure", message)); 
                }
            })
            .catch(err => {
                message.push("We are not able to get this Resource details at the moment");
                dbInstance.close();
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            dbInstance.close();
            message.push("There was some error while connecting to user database");
            return (util.returnResp("Failure", message, err));
        });
    },
    removePrivelage(email_id, access_level) {
        let message = [];
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            let query = {email_id};
            return db.find(query).toArray()
            .then(data => {
                if(data.length > 0) {
                    let privelageKeys = [];
                    if(access_level.length > 0) {
                        privelageKeys = main_controller.checkPrivelageKeys(access_level);
                    }
                    let toUpdate = { $pull: { privelage_level: {$in: privelageKeys } } }
                    return db.updateOne(query, toUpdate)
                    .then(data => {
                        dbInstance.close();
                        if(data.result && data.result.nModified > 0) {
                            message.push("We have successfully removed the privelage from user");    
                            return (util.returnResp("Success", message));
                        }
                        message.push("There is no updates in the privelage");
                        return (util.returnResp("Failure", message));                    
                    })
                    .catch(err => {
                        message.push("There was some error while removing privelage from user");
                        return (util.returnResp("Failure", message, err));
                    });
                }
                else {
                    dbInstance.close();
                    message.push("There is no user data found for the email id provided");
                    return (util.returnResp("Failure", message)); 
                }
            })
            .catch(err => {
                message.push("We are not able to get this Resource details at the moment");
                dbInstance.close();
                return (util.returnResp("Failure", message, err));
            });
        })
        .catch(err => {
            dbInstance.close();
            message.push("There was some error while connecting to user database");
            return (util.returnResp("Failure", message, err));
        });
    },
    verifyUser(email_id, password) {
        let message = [];
        let toFind = {email_id};
        return dbUtil.connectDb()
        .then(dbInstance => {
            let db = dbInstance.db(DBNAME).collection(collectionName);
            return db.find(toFind).toArray()
            .then(data => {
                if(data.length > 0) {
                    let userData = data[0];
                    if(userData.password == password) {
                        return {
                            status: "Success",
                            data: {
                                email_id: userData.email_id, 
                                employee_id: userData.employee_id, 
                                name: userData.name,
                                designation: userData.designation,
                                privelage_level: userData.privelage_level
                            }
                        }
                    }
                    else {
                        return {
                            status: "Failure"
                        }
                    }
                }
                else {
                    dbInstance.close();
                    message.push("There is no user data found for the email id provided");
                    return (util.returnResp("Failure", message));
                }
            })
        })
    }
}

module.exports = UserAdminModel;