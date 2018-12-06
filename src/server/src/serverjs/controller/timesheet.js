const timesheetModel = require('../model/timesheet');
const util = require('../utils/util.js');
const timesheetController = {
    getData(req, res) {
        let reqBody = req.body || {};
        let employee_id = req.session && req.session.user && req.session.user.employee_id ? req.session.user.employee_id : "";
        /*let mandatoryFields = [
            {
                "key": "fromtime",
                "value": reqBody.fromtime,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            },
            {
                "key": "totime",
                "value": reqBody.totime,
                "isMandatory": true,
                "pattern": /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
                "formatType": "date"
            }
        ]
        let currentDate = new Date().getTime();
        let fromTime = new Date(reqBody.fromtime).getTime();
        let toTime = new Date(reqBody.totime).getTime();
        if(fromTime && toTime)
        {
            if(fromTime > currentDate)
            {
                errors.push("From Date should not be future date.");
            }
            if(toTime > currentDate)
            {
                errors.push("End Date should not be future date.");
            }
        }*/
        if(employee_id == "") {
            res.send(util.returnResp("Failure", "Session Expired."));
            return;
        }
        else
        {
            timesheetModel.getData(employee_id)
            .then(data => {
                let resp = data;
                if(resp.status == "Success") {
                    res.send(resp); 
                }
                else {
                    res.send(resp);
                }
            })
            .catch(err => {
                let message = [];
                message.push("There was some error while getting data");
                res.send(util.returnResp("Failure", message, err));
            });
        }
    }
}
module.exports = timesheetController;