const util = require('../utils/util.js');

const accessKeys = [
    "resource_view",
    "resource_edit",
    "client_view",
    "client_edit",
    "request_resource",
    "functional_management",
    "account",
    "timesheetAccess",
    "admin"
]

const userAuthentication = {
    getPrivelageKeys(key) {
        let response = {};
        if(key) {
            let privelageKey = key.filter(keyValue => accessKeys.indexOf(keyValue) != -1);
            response.redirectData = [];
            let obj = {};
            let defaultViewSelected = false;
            if(privelageKey.length > 0) {
                if(privelageKey.indexOf("account") != -1 || privelageKey.indexOf("admin") != -1) {
                    obj = {
                        redirectLink: "account",
                        name: "Account Management"
                    }
                    response.redirectData.push(obj);
                }
                if(privelageKey.indexOf("resource_view") != -1 || privelageKey.indexOf("resource_edit") != -1 || privelageKey.indexOf("admin") != -1) {
                    obj = {
                        redirectLink: "hrlanding",
                        name: "Employee Profile"
                    }
                    response.redirectUrl = "/hrlanding";
                    response.redirectData.push(obj);
                }
                if(privelageKey.indexOf("client_view") != -1 || privelageKey.indexOf("client_edit") != -1 || privelageKey.indexOf("admin") != -1) {
                    obj = {
                        redirectLink: "dmlanding",
                        name: "Project Management",
                        selected: true
                    }
                    defaultViewSelected = true;
                    response.redirectUrl = "/dmlanding";
                    response.redirectData.push(obj);
                }
                if(privelageKey.indexOf("request_resource") != -1 || privelageKey.indexOf("functional_management") != -1 || privelageKey.indexOf("admin") != -1) {
                    obj = {
                        redirectLink: "dmlanding",
                        name: "Resource Management"
                    }
                    if(!defaultViewSelected) {
                        obj.selected = true;
                        defaultViewSelected = true;
                    }
                    response.redirectUrl = "/dmlanding";
                    response.redirectData.push(obj);
                }
                if(!response.redirectUrl) {
                    response.redirectUrl = "/account"
                    if(response.redirectData.length) {
                        response.redirectData[0].selected = true;
                    }
                }
                else if(!defaultViewSelected) {
                    if(response.redirectData.length) {
                        response.redirectData.map(data => {
                            if(data.redirectLink == "hrlanding") {
                                data.selected = true;
                                return;
                            }
                        })
                    }
                }
                if(privelageKey.indexOf("admin") != -1) {
                    response.privelage = accessKeys || [];
                }
                else {
                    response.privelage = privelageKey || [];
                }
            }
        }
        return response;
    },
    checkPrivelageKeys(key) {
        if(key) {
            let privelageKey = key.filter(keyValue => accessKeys.indexOf(keyValue) != -1);
            if(privelageKey.length > 0) {
                return privelageKey;
            }
            else {
                return [];
            }
        }
    }
}

module.exports = userAuthentication;