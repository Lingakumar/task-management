const DBNAME = "rmt";
const resourceMapperCName = "resource_mapper";
const resource_mapper = require('../model/resourceMapper');
const dbUtil = require("./dbUtil");
const util = require('../utils/util');
const timesheetMapper = {
    getData(reqBody , empid)
    {
        let message = [];
        let employee_id = empid ? empid : "";
        let fromdate = reqBody.fromtime;
        let todate = reqBody.totime;
        let toFind = {employee_id: employee_id}
        let toFindFuncnRes = {functional_manager_id: employee_id}
        let projectionFields = {
            "name": 1,
            "email_id": 1,
            "projects.clientId" : 1,
            "projects.projectId" : 1,
            "projects.project_name" : 1,
            "projects.client_name"  : 1,
            "department" : 1,
            "employee_id":1,
            "functional_manager_id" : 1,
            "_id": 0
        }
        if(employee_id && fromdate && todate)
        {
            return dbUtil.connectDb()
            .then(dbInstance => {
                let db = dbInstance.db(DBNAME).collection(resourceMapperCName);
                return db.find(toFind)
                .project(projectionFields)
                .toArray()
                .then(Empdata => {
                    dbInstance.close();
                    if(Empdata.length) {
                        message.push("Employee data retrived successfully");
                       return resource_mapper.getResourceDetails(null, toFindFuncnRes , projectionFields)
                        .then(functionaldata => {
                            if(functionaldata.length) {
                                message.push("Functional data retrived successfully");
                                let responseData = {"EmployeeData" : Empdata , "FunctionalData" : functionaldata}
                                return({message: message, userData: responseData});
                            }
                            else
                            {
                                return({message: message, userData: empData});
                            }
                        })
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
    }
}
module.exports = timesheetMapper;