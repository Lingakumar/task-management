import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../css/Hr.css';
import textJson from '../static/text.json';
import {Filter, Tab, TableBody , SwitchFunction , checkEmptyFields , maskFunction, getprivelage ,Form, MakeAjax, HandleFormErrors, validateMandatoryIp, renderSuccessPopUp} from'./utils/util';
import dateFormat from 'dateformat';
import '../css/AddResource.css';
import Cookies from 'js-cookie';
import ReactHTMLTableToExcel from './ReactHTMLTableToExcel';
class HrLanding extends Component {
    constructor(props)
    {
      super(props);
      this.state = {pancakeData :  Cookies.get('pancakeData') ? JSON.parse(Cookies.get('pancakeData')) : ""};
    }

    render() 
    {
        console.log(getprivelage("resource_edit"));
        return (
        <div className = "hrLandingPage">
            <div id = "hrmaincontainer" className = "hrmaincontainer">
            <div className="errorDom" id="errorDom"></div>
            <div id = "maskContainer" className="mask hideContainer" onClick = {maskFunction}></div>
                <Filter value = {textJson && textJson.hrFilter ? textJson.hrFilter : []} id = "hrFilter"/>
                <div className = "TableContainer">
                    <div id = "tabTopcontainer">
                    {getprivelage('resource_edit') ?
                        <Tab value = {textJson && textJson.hrTableTabs ? textJson.hrTableTabs : []} trigger = {true} defaultSelect =  {"view_/_update_profile"}/>
                        :
                        <Tab value = {textJson && textJson.hrTableTabsViewAccessOnly ? textJson.hrTableTabsViewAccessOnly : []} trigger = {true} defaultSelect =  {"view_/_update_profile"}/>
                    }
                    </div>
                    <div id = "switchTabsContainer">
                        <TableBody  headerData = {textJson && textJson.headerDataValue ? textJson.headerDataValue : ""}  columns = {textJson && textJson.columnsValue ? textJson.columnsValue : ""}/>
                    </div>
                </div>
                <div className = "export_cont">
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table="table"
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="Download as XLS"
                    />
                </div>   
            </div>
           
        </div>
        )
    }
}
export class AddResource extends Component {
    constructor(props) {
        super(props);
        this.state = {data: textJson.createResoruce , isfromFlag : this.props.fromFlag};
    }
    static addHrResoursefn(fieldValues , cbk)
    {
       
        let config = {}
        let errArray = [];
        if(validateMandatoryIp()){
            if(fieldValues)
            {
                var postData = {};
                var fname = fieldValues.first_name ? fieldValues.first_name : errArray.push("Employee First Name can't be empty");
                var lname = fieldValues.last_name ? fieldValues.last_name : errArray.push("Employee Last Name can't be empty");
                var mfname = fieldValues.functional_manager_fname ? fieldValues.functional_manager_fname : errArray.push("Manager first Name can't be empty");
                var mlname = fieldValues.functional_manager_lname ? fieldValues.functional_manager_lname : errArray.push("Manager last Name can't be empty");
                postData.employee_id = fieldValues.employee_id ? fieldValues.employee_id : errArray.push("Employee Id can't be empty");
                postData.name = fname + "|" + lname;
                postData.email_id =  fieldValues.email_id ? fieldValues.email_id : errArray.push("Email Id can't be empty");
                postData.gender = fieldValues.gender ? fieldValues.gender : errArray.push("Gender should be selected");
                postData.mobile_phone_number = fieldValues.mobile_phone_number ? String(fieldValues.mobile_phone_number) : errArray.push("Mobile number can't be empty");
                postData.address_line_1 = fieldValues.address_line_1 ? fieldValues.address_line_1 : errArray.push("Address Line-1 can't be empty");
                postData.city = fieldValues.city ? fieldValues.city : errArray.push("city can't be empty");
                postData.state = fieldValues.state ? fieldValues.state : errArray.push("state can't be empty");
                postData.nationality = fieldValues.nationality ? fieldValues.nationality : errArray.push("Nationality can't be empty");
                postData.primary_skill = fieldValues.primary_skill ? fieldValues.primary_skill : errArray.push("Primary Skills should be selected");
                postData.experience = fieldValues.experience ? fieldValues.experience : "0";
                postData.designation = fieldValues.designation ? fieldValues.designation : errArray.push("Designation should be selected");
                postData.personal_email_id = fieldValues.personal_email_id ? fieldValues.personal_email_id : errArray.push("Personal Email can't be empty");
                postData.country = fieldValues.country ? fieldValues.country : errArray.push("Country can't be empty");
                postData.pincode = fieldValues.pincode ? fieldValues.pincode : errArray.push("Zip Code can't be empty");
                postData.date_of_joining = fieldValues.date_of_joining ? fieldValues.date_of_joining : errArray.push("Joining Date should be selected");
                postData.date_of_birth = fieldValues.date_of_birth ? fieldValues.date_of_birth : errArray.push("DOB should be selected");
                postData.functional_manager_name = mfname + "|" + mlname ;
                postData.functional_manager_id = fieldValues.functional_manager_id ? String(fieldValues.functional_manager_id) : errArray.push("Reporting Manager Employee Id can't be empty");
                postData.blood_group = fieldValues.blood_group ? fieldValues.blood_group : errArray.push("Blood group should be selected");
                postData.department = fieldValues.department ? fieldValues.department : errArray.push("Department should be selected");
                if(fieldValues.address_line_2)
                {
                    postData.address_line_2 = fieldValues.address_line_2;
                }
                if(fieldValues.alternate_mobile_Number)
                {
                    postData.alternate_mobile_Number = fieldValues.alternate_mobile_Number;
                }
                if(fieldValues.secondary_skills)
                {
                    var secondary_skills = fieldValues.secondary_skills;
                    let splittedskills = secondary_skills.split(",");
                    let splittedskillsLen = secondary_skills.length;
                    let secondaryskillsArr = [];
                    for(let s=0 ; s < splittedskillsLen ; s++)
                    {
                        if(splittedskills[s])
                        {
                            let tempObj = {"value":splittedskills[s],"label":splittedskills[s]};
                            secondaryskillsArr.push(tempObj);
                        }
                    }
                    postData.secondary_skills = secondaryskillsArr;
                }
                if(fieldValues.pan_number)
                {
                    postData.pan_number = fieldValues.pan_number;
                }
                if(fieldValues.UAN_number)
                {
                    postData.UAN_number = fieldValues.UAN_number;
                }
                if(fieldValues.account_number)
                {
                    postData.account_number = fieldValues.account_number;
                }
                if(fieldValues.passport)
                {
                    postData.passport = fieldValues.passport
                }
            }
            if(errArray.length){
                ReactDOM.render(<HandleFormErrors value = {errArray}/>,document.getElementById('formErrorCont'));
            }
            config.apiUrl = "http://localhost:4000/resources/create";
            config.method = "post";
            config.postData = postData;
            config.scbk = function(data)
            {
                if(data.status === "Success")
                {
                    let successTxt = "Resource Added to Skava Family";
                    data.message = [];
                    data.message.push(successTxt);
                    renderSuccessPopUp(data.message);
                    cbk ? cbk() : ""
                }
                else
                {
                    console.log("error");
                    if(data && data.message){
                        ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                    }
                }
            };
            config.ecbk = function(data)
            {
                console.log("error")
                if(data && data.message){
                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                }
            };
            MakeAjax(config);
        }
    }
    render(){
       return(<div className="main_container"><Form data={this.state.data} id = "addresoruce_form"/> </div>)
    }
}
export class EditResource extends Component{
    constructor(props)
    {
        super(props);
        this.state = {prefilledData : this.props.prefilledData , data: textJson.createResoruce , staticDataCopy : []}
    }
    componentDidMount()
    {
        let prefilledData = this.state && this.state.prefilledData ? this.state.prefilledData : [];
        let staticData = this.state.data;
        let staticDataLen = staticData.length;
        let dataArr = [];
        var splittedName = prefilledData['name'] && prefilledData["name"].indexOf("|") >=0 ? prefilledData['name'].split("|") : prefilledData['name'] ;
        var functionalmngersplittedName = prefilledData['functional_manager_name'] && prefilledData["functional_manager_name"].indexOf("|") >=0 ? prefilledData['functional_manager_name'].split("|") : prefilledData['functional_manager_name'] ;
        if(Array.isArray(splittedName))
        {
            prefilledData["first_name"] = splittedName[0];
            prefilledData["last_name"] = splittedName[1];
        }
        else
        {
            prefilledData["first_name"] = splittedName;
        }
        if(Array.isArray(functionalmngersplittedName))
        {
            prefilledData["functional_manager_fname"] = functionalmngersplittedName[0];
            prefilledData["functional_manager_lname"] = functionalmngersplittedName[1];
        }
        else
        {
            prefilledData["functional_manager_fname"] = functionalmngersplittedName;
        }
        if(prefilledData['secondary_skills'])
        {
            let secondarySkillsData = prefilledData['secondary_skills'];
            let secondarySkillsDataLen = secondarySkillsData ? secondarySkillsData.length : 0;
            let secondaryskillsString = "";
            for(let idx = 0 ; idx < secondarySkillsDataLen ; idx++)
            {
                if(secondarySkillsData[idx])
                {
                    secondaryskillsString += secondarySkillsDataLen === idx +1 ? secondarySkillsData[idx].value.trim() : secondarySkillsData[idx].value.trim() + ","
                }
            }
            prefilledData['secondary_skills'] = secondaryskillsString;
        }
        let staticDataCopy = JSON.parse(JSON.stringify(staticData));
        for(let i=0 ; i< staticDataLen ; i++)
        {
            dataArr = staticData[i] && staticData[i].data ? staticData[i].data : [];
            let dataArrLen = dataArr.length;
            for(let j=0; j<dataArrLen; j++)
            {
                staticDataCopy[i].data[j].value = prefilledData[dataArr[j].id];
                if(dataArr[j].id === "email_id")
                {
                    staticDataCopy[i].data[j].isDisabled = true;
                }
                if(dataArr[j].id === "employee_id")
                {
                    staticDataCopy[i].data[j].isDisabled = true;
                }
            }
        }
        this.setState({staticDataCopy : staticDataCopy})
    }
    static editResourcefn(fieldValues)
    {
        let config = {};
        let manipulatedSkills = {};
        if(manipulatedSkills = JSON.parse(JSON.stringify(checkEmptyFields(fieldValues))))
        {
            var empidVal = document.getElementById('employee_id') && document.getElementById('employee_id').lastElementChild && document.getElementById('employee_id').lastElementChild.lastElementChild && document.getElementById('employee_id').lastElementChild.lastElementChild.value ? document.getElementById('employee_id').lastElementChild.lastElementChild.value : "";
            manipulatedSkills.employee_id = empidVal;
            if(manipulatedSkills.secondary_skills)
            {
                var secondary_skills = JSON.parse(JSON.stringify(manipulatedSkills.secondary_skills));
                let splittedskills = secondary_skills.split(",");
                let splittedskillsLen = secondary_skills.length;
                let secondaryskillsArr = [];
                for(let s=0 ; s < splittedskillsLen ; s++)
                {
                    if(splittedskills[s])
                    {
                        let tempObj = {"value":splittedskills[s],"label":splittedskills[s]};
                        secondaryskillsArr.push(tempObj);
                    }
                }
                manipulatedSkills.secondary_skills = secondaryskillsArr;
            }
            if(manipulatedSkills.first_name && manipulatedSkills.last_name)
            { 
                var fname = manipulatedSkills.first_name ? manipulatedSkills.first_name : "";
                var lname = manipulatedSkills.last_name ? manipulatedSkills.last_name : "";
                manipulatedSkills.name = fname + "|" + lname;
                delete(manipulatedSkills.first_name);
                delete(manipulatedSkills.last_name);
            }
            if(manipulatedSkills.functional_manager_fname && manipulatedSkills.functional_manager_lname)
            {
                var mfname = manipulatedSkills.functional_manager_fname ? manipulatedSkills.functional_manager_fname : "";
                var mlname = manipulatedSkills.functional_manager_lname ? manipulatedSkills.functional_manager_lname : "";
                manipulatedSkills.functional_manager_name = mfname + "|" + mlname ;
                delete(manipulatedSkills.functional_manager_fname);
                delete(manipulatedSkills.functional_manager_lname);
            }
            delete(manipulatedSkills["email_id"]) // email id is not editable.
            config.postData = manipulatedSkills;
            config.apiUrl = "http://localhost:4000/resources/update";
            config.method = "put";
            config.scbk = function(data)
            {
                if(data.status === "Success")
                {
                    let successTxt = "Resource Updated Successfully";
                    if(!data.message && !data.message.length){
                        data.message = [];
                        data.message.push(successTxt);
                    }
                    renderSuccessPopUp(data.message);
                }
                else
                {
                    console.log("error");
                    if(data && data.message){
                        ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                    }
                }
            };
            config.ecbk = function(data)
            {
                console.log("error")
                ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
            };
            MakeAjax(config);
        }
    }
    render()
    {
        return(<div className="main_container"><Form data={this.state.staticDataCopy} id = "editresource_form"/> </div>)
    }
}
export class Exit extends Component{
    constructor(props)
    {
        super(props);
        this.state = {isDisabled : false , fieldvalues: {}}
        this.handleInputValues = this.handleInputValues.bind(this);
    }
    static exitHrResoursefn(fieldValues)
    {
        let config = {}
        let postData = {};
        let errArray = [];
        if(validateMandatoryIp()){
            if(fieldValues)
            {
                postData.employee_id = fieldValues.emp_id ? fieldValues.emp_id : errArray.push("Employee Id can't be empty");
                postData.date_of_releiving =  fieldValues.dateofrelieving ? fieldValues.dateofrelieving : dateFormat(new Date(), "mm/dd/yyyy");
                postData.reason = fieldValues.relievingreason ? fieldValues.relievingreason : errArray.push("Reason for Relieving can't be empty");
                postData.acceptance_status =  fieldValues.acceptresgn ? "Accepted" : errArray.push("Please Accept Resignation");
                postData.email_id =  fieldValues.emailid ? fieldValues.emailid : errArray.push("Please Enter Email Id");
                fieldValues.hrcomments ? postData.comments = fieldValues.hrcomments : "";
                postData.department =  fieldValues.department ? fieldValues.department : errArray.push("Please Enter Department");
                postData.employee_name =  fieldValues.emp_name ? fieldValues.emp_name : errArray.push("Please Enter Employee Name");
                if(fieldValues.functional_manager_id)
                {
                    postData.replacement_manager_id = fieldValues.functional_manager_id;
                }
            }
            if(errArray.length){
                ReactDOM.render(<HandleFormErrors value = {errArray}/>,document.getElementById('formErrorCont'));
            }
            else{
                config.apiUrl = "//localhost:4000/resources/exit";
                config.method = "put";
                config.postData = postData;
                config.scbk = function(data)
                {
                    if(data.status === "Success"){
                        console.log("success");
                        data.message ? renderSuccessPopUp(data.message) : renderSuccessPopUp();
                    }
                    else{
                        console.log("error");
                        if(data && data.message){
                            ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                        }
                    }
                };
                config.ecbk = function(data)
                {
                    console.log("error");
                    if(data && data.message){
                        ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                    }
                };
                MakeAjax(config);
            }
        }
    }
    static prefillData(fieldvalues)
    {
        let config = {}
        let empid = fieldvalues.id && fieldvalues.id === "emp_id" ? fieldvalues.value : "";
        if(empid)
        {
            config.apiUrl = "http://localhost:4000/resources/check-resource-availability";
            config.method = "post";
            config.postData = {"employee_id":empid};
            config.scbk = function(data)
            {
                let staticDataCopy = JSON.parse(JSON.stringify(textJson && textJson.exitResource ? textJson.exitResource : []));
                if(data && data.status === "Success"){
                   if(data.data)
                   {
                    let prefilledData = data.data;
                    let staticDataCopyLen = staticDataCopy.length;
                    prefilledData['emp_name'] = prefilledData['emp_name'].replace("|"," ");
                    for(let i = 0 ; i< staticDataCopyLen ; i++)
                    {
                        let dataArr = staticDataCopy[i].data;
                        let dataArrLen = dataArr.length;
                        for(let j=0 ; j < dataArrLen ; j++)
                        {
                            staticDataCopy[i].data[j].value = prefilledData[dataArr[j].id];
                            if(staticDataCopy[i].data[j].id === "emp_id")
                            {
                                staticDataCopy[i].data[j].value = empid;
                            }
                            if(staticDataCopy[i].data[j].id === "emailid")
                            {
                                if(prefilledData.availablity)
                                {
                                    let functionalMngerObj = {"id":"functional_manager_id","className":"user_fn","label":"Alternate Manager Id","type":"input","sub_type":"text","isRequired":true}
                                    staticDataCopy[i].data.splice(j+1, 0, functionalMngerObj)
                                }
                            }
                        } 
                    }
                   }            
                }
                else{
                    if(staticDataCopy && staticDataCopy[0] && staticDataCopy[0].data && staticDataCopy[0].data[0] && staticDataCopy[0].data[0].id === "emp_id"){
                        staticDataCopy[0].data[0].value = empid;
                    }
                    console.log("Exit Prefilling Data Error -> Status failure");
                }
                ReactDOM.render(<div className = "main_container"><Form id = "exitResoruce_form" data={staticDataCopy}/></div>,document.getElementById('switchTabsContainer'))
            };
            config.ecbk = function(data)
            {
                console.log("Exit Prefilling Data Error -> Errorcbk trigered");
            };
            MakeAjax(config);
        }
        else
        {
            console.log("Exit Prefilling Data Error -> Employee id Not found")
        }
    }
    handleInputValues(values) {
        let id = values.id;
        this.state.fieldvalues[id] = values.value;
        //this.setState({[id] : values.value});
        console.log(this.state);
    }
    render()
    {
        return(
            <div className = "exitModel">
                <div className="main_container">
                     <Form id = "exitResoruce_form" data={textJson && textJson.exitResource ? textJson.exitResource : []}/>
                </div>
            </div>
        )
    }
}

export default HrLanding;