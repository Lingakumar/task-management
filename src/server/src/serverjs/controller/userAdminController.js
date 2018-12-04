const util = require('../utils/util.js');
const adminModel = require("../model/userAdminModel");

const UserAdminController = {
    activateAccount(req, res) {
        let reqBody = req.body || {};
        let mandatoryFields = [
            {
                "key": "email_id",
                "value": reqBody.email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            },
            {
                "key": "privelage_level",
                "value": reqBody.privelage_level,
                "type": "Array"
            }
        ];
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let email = reqBody.email_id;
        let access = reqBody.privelage_level || [];
        adminModel.activateAccount(email, access)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    deActivateAccount(req, res) {
        let reqBody = req.body || {};
        let mandatoryFields = [
            {
                "key": "email_id",
                "value": reqBody.email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }
        ];
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let email = reqBody.email_id;
        adminModel.deActivateAccount(email)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    addPrivelageToUser(req, res) {
        let reqBody = req.body || {};
        let mandatoryFields = [
            {
                "key": "email_id",
                "value": reqBody.email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            },
            {
                "key": "privelage_level",
                "value": reqBody.privelage_level,
                "isMandatory": true,
                "type": "Array"
            }
        ];
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let email = reqBody.email_id;
        let access = reqBody.privelage_level;
        adminModel.addPrivelage(email, access)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    },
    removePrivelageFromuser(req, res) {
        let reqBody = req.body || {};
        let mandatoryFields = [
            {
                "key": "email_id",
                "value": reqBody.email_id,
                "isMandatory": true,
                "pattern": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            },
            {
                "key": "privelage_level",
                "isMandatory": true,
                "value": reqBody.privelage_level,
                "type": "Array"
            }
        ];
        let resObj = util.validateRequestBody(mandatoryFields, reqBody);
        let errors = resObj.errors || [];
        reqBody = resObj.reqBody || {};
        if(errors && errors.length > 0) {
            res.send(util.returnResp("Failure", errors));
            return;
        }
        let email = reqBody.email_id;
        let access = reqBody.privelage_level;
        adminModel.removePrivelage(email, access)
        .then(data => res.send(data))
        .catch(err => res.send(err));
    }    
}

module.exports = UserAdminController;