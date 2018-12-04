const historyCollectionName = "resources_history";

const dbUtil = require("./dbUtil");
const util = require('../utils/util');
const DBNAME = "rmt";

const resourceHistory = {
    async addResource(obj) {
        let dbInstance = obj.db || await dbUtil.connectDb();
        let historyDb = dbInstance.db(DBNAME).collection(historyCollectionName);
        let userData = obj.data && obj.data.value ? obj.data.value : {};
        let message = obj.message || [];
        return historyDb.insertOne(userData)
        .then(data => {
            dbInstance.close();
            let insertionObj = data || {};
            if(insertionObj.insertedCount > 0) {
                message.push("We have successfully updated the history of user");    
                return (util.returnResp("Success", message));
            }
            message.push("There was some error while deleting the user data");
            return (util.returnResp("Failure", message)); 
        })
        .catch(err => {
            message.push("There was some error while updating user data");
            return (util.returnResp("Failure", message, err));
        }); 
    }
}

module.exports = resourceHistory;