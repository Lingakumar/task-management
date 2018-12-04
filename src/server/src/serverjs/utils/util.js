var nodemailer = require('nodemailer');
const Util = {
    getRandomNumber(min) {
        //return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
        return (Math.floor(Math.random() * Math.pow(10,min))).toString();
    },
    returnResp(status, message, response) {
        let obj = {
            status: status || "",
            message: message || [],
        }
        if(response) {
            obj.data = response;
        }
        return obj;
    },
    validateRequestBody(mandatoryFields, reqBody) {
        let errObj = [];
        let reqBodyKeys = Object.keys(reqBody);
        if(mandatoryFields)
        {
            mandatoryFields.map(fields => {
                let message = "";
                let key = fields.key;
                let reqBodyKeyIndex = reqBodyKeys.indexOf(key);
                let formatType = fields.formatType || "format";
                if(reqBodyKeyIndex != -1) {
                    let fieldValue = fields.value;
                    reqBodyKeys.splice(reqBodyKeyIndex, 1);
                    if(typeof(fieldValue) != "undefined") {
                        if(!fields.type) {
                            fields.type = "string";
                        }
                        if((fields.type != "Array" && typeof(fieldValue) === fields.type) || (fields.type == "Array" && Array.isArray(fieldValue))) {
                            if(((typeof(fieldValue) === 'string' && fieldValue.trim() == "") || Array.isArray(fieldValue) && fieldValue.length == 0)) {
                                if(fields.isMandatory) {
                                    message = `Value for ${key} cannot be empty.`;
                                }
                                else {
                                    delete reqBody[key];
                                }
                            }
                            else if(fields.pattern) {
                                let value = new RegExp(fields.pattern);
                                if(!value.test(fieldValue)) {
                                    message = `Please enter a valid ${key}.`;
                                }
                            }
                        }
                        else {
                            message = `${key} is not in valid ${formatType}.`;
                        }
                    }
                    else if(fields.isMandatory) {
                        message = `${key} fieldValue is a mandatory field.`;
                    }    
                }
                if(message) {
                    errObj.push(message);
                }
            })
            reqBodyKeys.map(key => {
                delete(reqBody[key]);
            })
            let respObj = {
                errors: errObj,
                reqBody
            }
            return respObj;
        }
    },
    getAvailableFields(arr, reqBody) {
        let obj = {};
        arr.map(field => {
            if(reqBody[field]) {
                obj[field] = reqBody[field];
            }
        });
        return obj;
    },
    sendMailNotification(mailContent) {
        var smtpTransport = nodemailer.createTransport(
            {  
                service: 'gmail',  
                auth: {  
                user: "skavaforum@gmail.com",  
                pass: "developers@123"  
                }  
            }); 
        const mailOptions = {  
            to: mailContent.toEmail ? mailContent.toEmail : 'dineshkumar.a@skava.com',  
            from: 'passwordreset@demo.com',  
            subject: mailContent.subject,  
            text: mailContent.content
        }; 
        smtpTransport.sendMail(mailOptions, function(err) {                 
            console.log({status : 'success', message : 'An e-mail has been sent to the above mail-Id with further instructions.'});
            //done(err, 'done');  
        });
    },
    mailTemplate : {
        hrModule: {
            addResourceFMNotification: "Hi <FMName>,\n\n<RName> has been added under your guidance. \n\nKindly visit our portal to know more details about the resource.\n\n\nThanks,\nSkava Team",
            exitResourceFMNotification: "Hi <FMName>,\n\n<RName> has been requested for exit.\n\nKindly visit our portal to know more details about the resource.\n\n\nThanks,\nSkava Team"
        },
        dmModule: {
            resourceRequestFMNotification: "Hi <FMName>,\n\n<RName> is requested by <RRName> for <ProjectName> project from <StartDate> to <EndDate>.\n\nKindly visit our portal to approve/reject the request.\n\n\nThanks,\nSkava Team",
            resourceApprovedRRNotification: "Hi <RRName>,\n\nYour request has been approved by <FMName>.\n\n\nThanks,\nSkava Team",
            resourceApprovedRNotification: "Hi <RName>,\n\nYou have been assigned for <ProjectName> project from <StartDate> to <EndDate>.\n\nKindly reach out your functional manager for more details.\n\n\nThanks,\nSkava Team",
            resourceDeclinedRRNotification: "Hi <RRName>,\n\nYour request for <RName> has been declined by <FMName>.\n\nKindly reach out the approver for further details.\n\n\nThanks,\nSkava Team",
            releaseResourceFMNotification: "Hi <FMName>,\n\n<RName> is released from <ProjectName> project by <RRName>. Kindly reach out the DM for further details.\n\n\nThanks,\nSkava Team",
            releaseResourceRNotification: "Hi <RName>,\n\nYou have been released from <ProjectName> project from today.\n\nKindly reach out your functional manager for more details.\n\n\nThanks,\nSkava Team",
            resourceModifyFMNotification: "Hi <FMName>,\n\n<RName>'s details were modified in <ProjectName> project by <RRName>.\n\nKindly visit our portal to know more details.\n\n\nThanks,\nSkava Team",
            resourceModifyRNotification: "Hi <RName>,\n\nYour details were modified in <ProjectName> project by <RRName>.\n\nKindly reach out your functional manager for more details.\n\n\nThanks,\nSkava Team"
        }
    }
}

module.exports = Util;