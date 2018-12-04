import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../css/Dm.css';
import staticTxtObj from '../static/text.json';
import {Filter, getprivelage , Tab, TableBody , Form, maskFunction ,  validateMandatoryIp, HandleFormErrors, MakeAjax, renderSuccessPopUp, SwitchFunction} from'./utils/util';
import dateFormat from 'dateformat';
import Cookies from 'js-cookie';
export class DmLanding extends Component {
    constructor(props)
    {
      super(props);
      this.navigateLink = this.navigateLink.bind(this);
      this.getProjects = this.getProjects.bind(this);
      this.state = {pancakeData :  Cookies.get('pancakeData') ? JSON.parse(Cookies.get('pancakeData')) : ""}
    }
    navigateLink(e)
    {
        ReactDOM.render(<ProjectsPage defaultSelectTab = "basic_details"/>,document.getElementById('mainContainer'));
        SwitchFunction('basic_details','','','','','');
    }
    componentDidMount()
    {
        if(this.props.makeCall)
        {
            this.getProjects();
        }
        this.removeWindowDetails();
    }
    componentDidUpdate(){
        this.removeWindowDetails();
    }
    removeWindowDetails(){
        delete window.projectId;
        delete window.clientId;
        delete window.startDate;
        delete window.endDate;
        delete window.client_name;
        delete window.subproject;
    }
    getProjects(filterObj) {
        var config = {};
        filterObj = filterObj ? filterObj :{};
        let successCbk = function(data) {
            if(data.status && data.status.toLowerCase() === "success" && data.message && data.message.data) {
                ReactDOM.render(<ProjectTableBody  headerData = {staticTxtObj && staticTxtObj.projectHeaderData ? staticTxtObj.projectHeaderData : ""}  columns = {staticTxtObj && staticTxtObj.projectColumnsValue ? staticTxtObj.projectColumnsValue : ""} bodydata = {data.message.data}/>,document.getElementById('switchTabsContainer'));
            }
        }
        let errorCbk = function(data) {
            console.log(data);
        }
        config.postData = {"limit": 10, "page": 1, "filters": [filterObj]};
        config.method = "post";
        config.apiUrl = "//localhost:4000/project/getAllProjects";
        config.scbk = successCbk;
        config.ecbk = errorCbk;
        MakeAjax(config);
    }
    render() 
    {
        return (
            <div className = "DmLandingPage">
                <div id = "hrmaincontainer" className = " Dmmaincontainer">
                    <div className = "errorDom" id = "errorDom"></div>
                    <div id = "maskContainer" className="mask hideContainer" onClick = {maskFunction}></div>
                        <Filter value = {staticTxtObj && staticTxtObj.dmFilter ? staticTxtObj.dmFilter : []} cbk={this.getProjects} id="dmFilter"/>
                        { getprivelage("client_edit") ? 
                            <div onClick = {this.navigateLink} className = "createProjLink">Create New Project</div>
                        :""}
                        <div className = "TableContainer">
                            <div id = "switchTabsContainer">
                            </div>
                        </div> 
                    </div>
                
                {/* !this.props.triggerNavigation ?
                <Navigation value = {this.state.pancakeData && this.state.pancakeData.redirectData ? this.state.pancakeData.redirectData : []}/>
                :""*/}
            </div>
        )
    }
}

export class ProjectsPage extends Component {
    constructor(props)
    {
      super(props);
      this.state = {pancakeData :  Cookies.get('pancakeData') ? JSON.parse(Cookies.get('pancakeData')) : "" , noTriggerVal : this.props && this.props.noTriggerVal ? this.props.noTriggerVal : false , defaultSelectTab : this.props.defaultSelectTab ? this.props.defaultSelectTab : "basic_details"};
    }
    render()
    {
      return (
        <div className = "projectLandingPage">
            <div className = "projectmaincontainer">
                <div id = "maskContainer" className="mask hideContainer" onClick = {maskFunction}></div>
                <div className = "errorDom" id = "errorDom"></div>
                <div className = "TableContainer">
                    <div id = "tabTopcontainer">
                        {getprivelage("client_edit") ? 
                            <Tab value = {staticTxtObj && staticTxtObj.createProjTableTabs ? staticTxtObj.createProjTableTabs : []} trigger = {this.state.noTriggerVal ? false : true} defaultSelect =  {this.props.defaultSelectTab}/>
                            : 
                            <Tab value = {staticTxtObj && staticTxtObj.createProjTableTabsViewOnly ? staticTxtObj.createProjTableTabsViewOnly : []} trigger = {this.state.noTriggerVal ? false : true} defaultSelect =  {this.props.defaultSelectTab}/>
                        }                
                        </div>
                    <div id = "switchTabsContainer"></div>
                </div>
            </div>
            {/* <Navigation value = {this.state.pancakeData && this.state.pancakeData.redirectData ? this.state.pancakeData.redirectData : []}/> */}
        </div>
        )
    }
}
export class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static addProjBasicDetailsfn(fieldValues){
        if(validateMandatoryIp()){
            let config = {}
            let postData = {};
            let errArray = [];
            if(fieldValues){
                postData.client_name = fieldValues.client_name ? fieldValues.client_name : errArray.push("Client Name can't be empty");
                postData.sow =  fieldValues.sow ? fieldValues.sow : errArray.push("SOW can't be empty");
                postData.start_Date = fieldValues.start_Date ? fieldValues.start_Date : dateFormat(new Date(), "mm/dd/yyyy");
                postData.end_Date =  fieldValues.end_Date ? fieldValues.end_Date : dateFormat(new Date(), "mm/dd/yyyy");
                postData.project_id =  fieldValues.project_id ? fieldValues.project_id : errArray.push("Project ID can't be empty");
                postData.project_name = fieldValues.project_name ? fieldValues.project_name : errArray.push("Project Name can't be empty");
                postData.project_cost = fieldValues.project_cost ? fieldValues.project_cost : errArray.push("Project Cost can't be empty");
            }
            if(errArray.length){
                ReactDOM.render(<HandleFormErrors value = {errArray}/>,document.getElementById('formErrorCont'));
            }
            else{
                if(window.clientId)
                {
                    postData.client_id = window.clientId;
                    window.projectId = fieldValues.project_id;
                    window.startDate = fieldValues.start_Date;
                    window.endDate = fieldValues.end_Date;
                    config.apiUrl = "http://localhost:4000/project/update";
                    config.method = "put";
                    config.postData = postData;
                }
                else
                {
                    window.projectId = fieldValues.project_id;
                    window.clientId = fieldValues.clientId;
                    window.startDate = fieldValues.start_Date;
                    window.endDate = fieldValues.end_Date;
                    config.apiUrl = "http://localhost:4000/project/create";
                    config.method = "post";
                    config.postData = postData;
                }
                config.scbk = function(data)
                {
                    if(data.status === "Success"){
                        console.log("success");
                        let successTxt = "Please wait you will be redirected...";
                        if(!data.message && !data.message.length){
                            data.message = [];
                        }
                        data.message.push(successTxt);
                        if(data && data.data && data.data.client_id){
                            window.clientId =  data.data.client_id;
                        }
                        renderSuccessPopUp(data.message);
                        var rerenderResourceRequest = setInterval(function(){
                            var modifiedArray = [{"key":"Basic Details","isActive":true},{"key":"Assign / Request Resource","isActive":true},{"key":"Resource Cost","isActive":true}];
                            ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "assign_/_request_resource"/>,document.getElementById('tabTopcontainer'));
                            SwitchFunction('assign_/_request_resource','','','',"projectResource", "availableResource");
                            document.getElementsByClassName('backroundMask')[0].classList.add("hideContainer");
                            clearInterval(rerenderResourceRequest);
                        }, 3000);
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
    static addSubprojectfn(fieldValues)
    {
        if(validateMandatoryIp()){
            let config = {}
            let postData = {};
            let errArray = [];
            if(fieldValues){
                postData.client_name = fieldValues.client_name ? fieldValues.client_name : window.client_name ? window.client_name : errArray.push("Client Name can't be empty");
                postData.sow =  fieldValues.sow ? fieldValues.sow : errArray.push("SOW can't be empty");
                postData.start_Date = fieldValues.start_Date ? fieldValues.start_Date : dateFormat(new Date(), "mm/dd/yyyy");
                postData.end_Date =  fieldValues.end_Date ? fieldValues.end_Date : dateFormat(new Date(), "mm/dd/yyyy");
                postData.project_id =  fieldValues.project_id ? fieldValues.project_id : errArray.push("Project ID can't be empty");
                postData.project_name = fieldValues.project_name ? fieldValues.project_name : errArray.push("Project Name can't be empty");
                postData.project_cost = fieldValues.project_cost ? fieldValues.project_cost : errArray.push("Project Cost can't be empty");
                postData.client_id = window.clientId ? window.clientId : "";
            }
            if(errArray.length){
                ReactDOM.render(<HandleFormErrors value = {errArray}/>,document.getElementById('formErrorCont'));
            }
            else {
                config.apiUrl = "http://localhost:4000/project/addProject";
                config.method = "post";
                config.postData = postData;
                config.scbk = function(data)
                {
                    if(data.status === "Success"){
                        window.projectId = fieldValues.project_id;
                        window.clientId = fieldValues.clientId;
                        window.startDate = fieldValues.start_Date;
                        window.endDate = fieldValues.end_Date;
                        console.log("success");
                        let successTxt = "Please wait you will be redirected...";
                        if(!data.message && !data.message.length){
                            data.message = [];
                        }
                        data.message.push(successTxt);
                        renderSuccessPopUp(data.message);
                        var rerenderResourceRequest = setInterval(function(){
                            var modifiedArray = [{"key":"Basic Details","isActive":true},{"key":"Assign / Request Resource","isActive":true},{"key":"Resource Cost","isActive":true}];
                            ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "assign_/_request_resource"/>,document.getElementById('tabTopcontainer'));
                            SwitchFunction('assign_/_request_resource','','','',"projectResource", "availableResource");
                            document.getElementsByClassName('backroundMask')[0].classList.add("hideContainer");
                            clearInterval(rerenderResourceRequest);
                        }, 3000);
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
    render(){
        let propVal = this.props && this.props.value ? this.props.value :"";
        return(
            <div className="main_container">
                <Form id = {this.props.id ? this.props.id : "addProjBasic_form"} data={propVal !== "" ? propVal : (staticTxtObj && staticTxtObj.createProjBasic ? staticTxtObj.createProjBasic : [])}/>
            </div>
        )
    }
}

export class AddProjectResource extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleNextAction = this.handleNextAction.bind(this);
        this.handleFilterApply = this.handleFilterApply.bind(this);
        this.handleCancelAction = this.handleCancelAction.bind(this);
    }
    handleNextAction(event){
        event.preventDefault();
        var modifiedArray = [{"key":"Basic Details","isActive":true},{"key":"Assign / Request Resource","isActive":true},{"key":"Resource Cost","isActive":true}];
        ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "resource_cost"/>,document.getElementById('tabTopcontainer'));
        SwitchFunction('resource_cost' , '', '', '', '' ,'');
    }
    handleCancelAction(event){
        event.preventDefault();
        ReactDOM.render(<DmLanding makeCall = {true}/>,document.getElementById('mainContainer'));
    }
    handleFilterApply(filterObj){
        SwitchFunction('assign_/_request_resource' , '', filterObj, '', '', "availableResource");
    }
    render(){
        return(
            <div className="main_container add_project_info">
                <div id = "ProjectResource"></div>
                <Filter value = {staticTxtObj && staticTxtObj.addResourceFilter ? staticTxtObj.addResourceFilter : []} data = {this.props.data ? this.props.data : ""} id = "dmResourceFilter" cbk = {this.handleFilterApply}/>
                <div id = "ProjectAvailableResource"></div>
                <div className = "proj_btn_cont">
                    <div className="next_cont">
                        <button type = "button" className = "nextPage" onClick={this.handleNextAction}>Next</button>
                    </div>
                    <div className="cancel_cont">
                        <button type = "button" className = "cancelPage" onClick={this.handleCancelAction}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}
export class InvalidProject extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div className="main_container invalid_project_info">
                <div className="invalidProj_cont">
                    <div>{this.props.value}</div>
                </div>
            </div>
        )
    }
}
export class AddProjectResourceCost extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div className="main_container add_project_Cost">
                <ResourceCostTableBody  headerData = {staticTxtObj.projectresourcecostHeaderData}  columns = {staticTxtObj.projectresourcecostcolumnsValue} bodydata = {this.props.response}/>
            </div>
        )
    }
}
class ResourceCostTableBody extends Component
{
   constructor(props)
   {
       super(props);
       this.state = { totalCostValue : [] ,  fieldCostVal : [] , indexValue : 0 };
       this.handleOnChange = this.handleOnChange.bind(this);
       this.handleSaveAction = this.handleSaveAction.bind(this);
       this.handleCancelAction = this.handleCancelAction.bind(this);
       window.tempFlag = false;
   }
   handleOnChange(e)
    {
        if(e && e.target)
        {
            let currValue = e.target.value;
            let id = e.target.id;
            let noOfRes = e.target.getAttribute("noofresource");
            this.state.fieldCostVal[id] = currValue;
            let total = parseFloat(currValue) * parseInt(noOfRes); 
            this.state.totalCostValue[id] = total;
            this.setState({indexValue : this.state.indexValue +1})
            window.tempFlag = true;
            //this.forceUpdate();
        }            
    }
    handleCancelAction(event){
        event.preventDefault();
        ReactDOM.render(<DmLanding makeCall = {true}/>,document.getElementById('mainContainer'));
    }
    handleSaveAction(event){
        event.preventDefault();
        let saveCostConfig = {};
        let copyBodyData =  JSON.parse(JSON.stringify(this.props.bodydata ? this.props.bodydata : []));
        let individualFieldValues = this.state.fieldCostVal;
        let totlaFieldValues = this.state.totalCostValue;
        let projectId = window.projectId ? window.projectId : "";
        let clientId = window.clientId ? window.clientId : "";
        if(copyBodyData.length)
        {
            let copyBodyDataLen = copyBodyData.length;
            for(let i=0 ; i < copyBodyDataLen ; i++ )
            {
                let role = copyBodyData[i].role ? copyBodyData[i].role.toLowerCase() : "";
                if(copyBodyData[i] && copyBodyData[i].role && totlaFieldValues[role])
                {
                    copyBodyData[i].cost_per_resource = individualFieldValues[role];
                    copyBodyData[i].resource_cost = String(totlaFieldValues[role]);
                }
            }
        }
        saveCostConfig.apiUrl = "http://localhost:4000/project/add-resource-cost";
        saveCostConfig.method = "post";
        saveCostConfig.postData = {"client_id":clientId,"project_id":projectId,"resource_cost":copyBodyData}
        saveCostConfig.scbk = function(data)
        {
            if(data.status === "Success")
            {
                SwitchFunction('resource_cost' , '', '', '', '' ,'');
            }
            else
            {
                console.log("error");
                if(data && data.message){
                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                }
            }
        };
        saveCostConfig.ecbk = function(data)
        {
            console.log("error")
            if(data && data.message){
                ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
            }
        };
        MakeAjax(saveCostConfig);
    }
   render()
   {
    var thisObj = this;
    this.state["bodydata"] = this.props.bodydata;
        return (
        <form id= "resourceCost" action = "#">
            <div className="resourceCost_table"> 
                <table className="table">
                    <thead className="table_header">
                        <tr>
                        {
                            thisObj.props && thisObj.props.headerData ? thisObj.props.headerData.map(function(head , index){
                                return(
                                    <th key = {index}>{head}</th>
                                )
                            }) : ""
                        }
                        </tr>
                    </thead>
                    <tbody className="table_body">
                    {
                        this.props.bodydata && this.props.bodydata.length ? 
                            this.props.bodydata.map(function(row , index){
                                if(row.role && !window.tempFlag)
                                {
                                    thisObj.state.fieldCostVal[row.role.toLowerCase()] = row.cost_per_resource;
                                    thisObj.state.totalCostValue[row.role.toLowerCase()] = row.resource_cost;
                                }
                                return(
                                    <tr key = {index}>
                                        {
                                            thisObj.props.columns.map(function(column , key){
                                                return(
                                                    <td key = {key}>
                                                        {
                                                            column === "no" ? index + 1 
                                                            : column === "cost_per_resource" ? 
                                                            <input 
                                                                className="reqInput valueInput" 
                                                                placeholder = "Type Here" 
                                                                id = {row.role.toLowerCase()}
                                                                type= "number" 
                                                                required="required"
                                                                onChange={thisObj.handleOnChange}
                                                                noofresource = {row["count"]}
                                                                value = {thisObj.state.fieldCostVal[row.role.toLowerCase()]}
                                                            />
                                                            : column === "total_cost" ? <span id = {thisObj.state.indexValue}><RenderTotalCost totalCostValue = {thisObj.state.totalCostValue[row.role.toLowerCase()]}/> </span>
                                                            : row[column] ? row[column].replace("|", " ") :""
                                                        }
                                                    </td> 
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        : 
                        this.props.bodydata && Array.isArray(this.props.bodydata) ?
                            <tr className="norecordsfound">
                                <td>No Records Found...</td>
                            </tr>
                        : <tr></tr>
                    }
                    </tbody>
                </table>
                <div className=  "btn_cont">
                    <div className = "proj_btn_cont">
                        <div className="save_cont">
                            <button type = "button" className = "savePage" onClick={this.handleSaveAction}>Save</button>
                        </div>
                        <div className="cancel_cont">
                            <button type = "button" className = "cancelPage" onClick={this.handleCancelAction}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>)
    }
}
class RenderTotalCost extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render()
    {
        return (
            <span className = "totalCost" >$ {this.props.totalCostValue ?  this.props.totalCostValue : 0}</span>
        )
    }
}
export class ProjectTableBody extends Component {
    constructor(props) {
        super(props);
        this.state = {activePage: 1, bodydata: this.props.bodydata ? this.props.bodydata: ""};
    }
    componentWillReceiveProps(){
        if(this.props.bodydata) {
            this.state["bodydata"] = this.props.bodydata;
        }
    }
     render() {
        this.state["bodydata"] = this.props.bodydata;
        var thisObj = this;
        return(
            <div className="project_table"> 
                <table className="table">
                    <thead className="table_header">
                        <tr>
                        {
                            thisObj.props && thisObj.props.headerData ? thisObj.props.headerData.map(function(head , index){
                                return(
                                    <th key = {index}>{head}</th>
                                )
                            }) : ""
                        }
                        </tr>
                    </thead>
                    <tbody className="table_body">
                    {
                        this.props.bodydata && this.props.bodydata.length ? 
                            this.props.bodydata.map(function(bodydata , mainIndex){
                                return bodydata.projects && bodydata.projects.length && bodydata.projects.map(function(row, key){
                                    return(
                                        <tr key={key}>
                                            {
                                                thisObj.props.columns.map(function(column , index){
                                                    return(
                                                        bodydata.projects.length > 1 && key === 0 && (column === "no") ?
                                                        <td key = {index} rowSpan={bodydata.projects.length}>
                                                        {mainIndex + key + 1}
                                                        </td>
                                                        :  bodydata.projects.length > 1 && key === 0 && (column === "client_name") ? 
                                                        <td key = {index} rowSpan={bodydata.projects.length}>
                                                        {bodydata.client_name}
                                                        </td> 
                                                         : bodydata.projects.length > 1 && key === 0 && (column === "subproject") ? 
                                                         <td key = {index} rowSpan={bodydata.projects.length}>  { getprivelage("client_edit") ? <AddSubProject value = {{"client_id":bodydata.client_id,"client_name":bodydata.client_name,"project_id":row.project_id}}/> : "N/A"} </td> 
                                                        : column === "projAction" ?
                                                            <td key = {index}>
                                                            { getprivelage("client_edit") || getprivelage("client_view") ?
                                                                <DmProjects value = {{"client_id":bodydata.client_id,"project_id":row.project_id,"start_Date":row.start_Date,"end_Date":row.end_Date}}/>
                                                            : "N/A"}
                                                            </td>
                                                        : column === "subproject" && bodydata.projects.length < 2? 
                                                        <td key = {index}>
                                                            { getprivelage("client_edit") ?
                                                                <AddSubProject value = {{"client_id":bodydata.client_id,"client_name":bodydata.client_name,"project_id":row.project_id}}/>
                                                            : "N/A"}
                                                        </td>
                                                        : (column === "no") && key === 0?
                                                        <td key = {index} >
                                                        {mainIndex + key + 1}
                                                        </td>
                                                        : column === "client_name" && bodydata.projects.length < 2?
                                                        <td key = {index}>
                                                        {bodydata.client_name}
                                                        </td>
                                                        : column === "status" && !row[column] ?
                                                        <td key = {index}>-</td>
                                                        : row[column] ?
                                                        <td key = {index}>
                                                        {row[column]}
                                                        </td>
                                                        : column && column !== "no" && column !== "client_name" && column !== "subproject" && !row[column] ?
                                                        <td key = {index}>
                                                        -
                                                        </td>
                                                        : ""
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            })
                        : 
                        this.props.bodydata && Array.isArray(this.props.bodydata) ?
                            <tr className="norecordsfound">
                                <td>No Records Found...</td>
                            </tr>
                        : <tr></tr>
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}
export class DmProjects extends Component
{
    constructor(props , context)
    {
        super(props , context);
        this.addResourceIconClick = this.addResourceIconClick.bind(this);
        this.editProjectIconClick = this.editProjectIconClick.bind(this);
        this.state = {pancakeData : Cookies.get('pancakeData') ? JSON.parse(Cookies.get('pancakeData')) : ""};
    }
    editProjectIconClick(elem)
    {
        let targetElem = elem.target;
        window.projectId = targetElem.getAttribute("data-projid") != null ? targetElem.getAttribute("data-projid") : "";
        window.clientId  = targetElem.getAttribute("data-clientid") != null ? targetElem.getAttribute("data-clientid") : "";
        window.startDate = targetElem.getAttribute("data-startdate") != null ? targetElem.getAttribute("data-startdate") : "";
        window.endDate   = targetElem.getAttribute("data-enddate") != null ? targetElem.getAttribute("data-enddate") : "";
        ReactDOM.render(<ProjectsPage noTriggerVal = {true} defaultSelectTab = {"basic_details"}/>,document.getElementById('mainContainer'));
        SwitchFunction('basic_details','','','','','');
    }
    addResourceIconClick(elem){
        console.log(elem);
        let targetElem = elem.target;
        window.projectId = targetElem.getAttribute("data-projid") != null ? targetElem.getAttribute("data-projid") : "";
        window.clientId  = targetElem.getAttribute("data-clientid") != null ? targetElem.getAttribute("data-clientid") : "";
        window.startDate = targetElem.getAttribute("data-startdate") != null ? targetElem.getAttribute("data-startdate") : "";
        window.endDate   = targetElem.getAttribute("data-enddate") != null ? targetElem.getAttribute("data-enddate") : "";
        ReactDOM.render(<ProjectsPage noTriggerVal = {true} defaultSelectTab = {"assign_/_request_resource"}/>,document.getElementById('mainContainer'));
        SwitchFunction('assign_/_request_resource','','','',"projectResource", "availableResource");
    }
    render()
    {
        this.state = {value : this.props.value};
        return(
            <span>
                {getprivelage("client_view") || getprivelage("client_edit")?
                    <div className = "addIconCont">
                        <span className = "addResourceIcon"  title = {getprivelage("client_edit") ?  "Add/Edit Project Resource" : "View Project Resource"} data-clientid = {this.state.value.client_id} data-projid = {this.state.value.project_id} data-startdate = {this.state.value.start_Date} data-enddate = {this.state.value.end_Date} onClick = {this.addResourceIconClick}></span>
                    </div>
                :""}
                {getprivelage("client_edit") ?
                <div className = "editIconCont">
                    <span className = "editIcon" title = "Edit Project" data-clientid = {this.state.value.client_id} data-projid = {this.state.value.project_id} data-startdate = {this.state.value.start_Date} data-enddate = {this.state.value.end_Date} onClick = {this.editProjectIconClick}></span>
                </div>
                :""}
            </span>
        )
    } 
}
export class AddSubProject extends Component
{
    constructor(props)
    {
        super(props);
        this.addSubProjectIconClick = this.addSubProjectIconClick.bind(this);
    }
    addSubProjectIconClick(elem)
    {
        let targetElemnt = elem.target;
        ReactDOM.render(<ProjectsPage noTriggerVal = {false} defaultSelectTab = {"basic_details"}/>,document.getElementById('mainContainer'));
        window.client_name = targetElemnt.getAttribute("data-clientname") != null ? targetElemnt.getAttribute("data-clientname") : "";
        window.clientId  = targetElemnt.getAttribute("data-clientid") != null ? targetElemnt.getAttribute("data-clientid") : "";
        //window.projectId = targetElemnt.getAttribute("data-projectid") != null ? targetElemnt.getAttribute("data-projectid") : "";
        window.subproject = true;
        SwitchFunction('basic_details','','','','','');
    }
    render()
    {
        return(
            <span>
                <div className = "addIconCont">
                    <span data-projectid = {this.props.value.project_id} data-clientid = {this.props.value.client_id ? this.props.value.client_id : ""} data-clientname = {this.props.value.client_name ? this.props.value.client_name : ""} className = "addsubprojectIconIcon" title = "Add Sub Project" onClick = {this.addSubProjectIconClick}></span>
                </div>
            </span>
        )
    }
}
export class ResourceAction extends Component
{
    constructor(props , context)
    {
        super(props , context);
        this.editIconClick = this.editIconClick.bind(this);
        this.removeIconclick = this.removeIconclick.bind(this);
    }
    editIconClick(elem)
    {
        let targetElem = elem.target;
        let empId  = targetElem.getAttribute("data-empid") != null ? targetElem.getAttribute("data-empid") : "";
        let oldData = localStorage.getItem("projectResourceData") ? JSON.parse(localStorage.getItem("projectResourceData")) : "";
        let oldDataLen = oldData ? oldData.length : 0;
        for(let idx=0; idx<oldDataLen; idx++)
        {
            if(oldData[idx] && oldData[idx].employee_id && oldData[idx].employee_id === empId)
            {
                oldData[idx].resourceStartDate = oldData[idx].projects[0].start_date;
                oldData[idx].resourceRole = oldData[idx].projects[0].role;
                oldData[idx].resourceEndDate = oldData[idx].projects[0].end_date;
                oldData[idx].resourceAllocatedPercent = oldData[idx].projects[0].allocation;
                oldData[idx].resourceAction = "editAction"
            }
        }
        ReactDOM.render(<div><div className = "tableHeading">Project Allocated Resource : </div><TableBody id="editResourceAction" headerData = {staticTxtObj.projectresourceHeaderData}  columns = {staticTxtObj.projectresourceColumnsValue} bodydata = {oldData}/></div>,document.getElementById('ProjectResource'));
    }
    removeIconclick(elem)
    {
        let targetElem = elem.target;
        let dataObj = {}
        dataObj.project_id = targetElem.getAttribute("data-projid") != null ? targetElem.getAttribute("data-projid") : "";
        dataObj.client_id  = targetElem.getAttribute("data-clientid") != null ? targetElem.getAttribute("data-clientid") : "";
        dataObj.employee_id  = targetElem.getAttribute("data-empid") != null ? targetElem.getAttribute("data-empid") : "";
        dataObj.rName = targetElem.getAttribute("data-rname") != null ? targetElem.getAttribute("data-rname") : "";
        //dataObj.rrName = targetElem.getAttribute("data-rrname") != null ? targetElem.getAttribute("data-rrname") : "";
        //dataObj.rrEmail = targetElem.getAttribute("data-rremail") != null ? targetElem.getAttribute("data-rremail") : "";
        dataObj.fmId = targetElem.getAttribute("data-fmid") != null ? targetElem.getAttribute("data-fmid") : "";
        let config = {};
        let successCbk = function(data) {
            if(data.status && data.status.toLowerCase() === "success" && data.message && data.message.length) {
                let successTxt = "Please wait you will be redirected...";
                if(!data.message && !data.message.length){
                    data.message = [];
                }
                data.message.push(successTxt);
                renderSuccessPopUp(data.message);
                var rerenderResourceRequest = setInterval(function(){
                    var modifiedArray = [{"key":"Basic Details","isActive":true},{"key":"Assign / Request Resource","isActive":true},{"key":"Resource Cost","isActive":true}];
                    ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "assign_/_request_resource"/>,document.getElementById('tabTopcontainer'));
                    SwitchFunction('assign_/_request_resource','','','',"projectResource", "availableResource");
                    document.getElementsByClassName('backroundMask')[0].classList.add("hideContainer");
                    clearInterval(rerenderResourceRequest);
                }, 3000);
            }
            else if(data.status && data.status.toLowerCase() === "failure"){
                if(data && data.message){
                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                }
            }
        }
        let errorCbk = function(data) {
            console.log(data);
            if(data && data.message){
                ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
            }
        }
        config.postData = dataObj;
        config.method = "delete";
        config.apiUrl = "//localhost:4000/resources/release-resource";
        config.scbk = successCbk;
        config.ecbk = errorCbk;
        MakeAjax(config);
    }
    render()
    {
        return(
            <span>
                <div className = "editIconCont">
                    <span className = "editIcon" title = "Edit Project Resource" onClick = {this.editIconClick.bind(this)} data-clientid = {window.clientId} data-projid = {window.projectId} data-empid = {this.props.value.employee_id}></span>
                </div>
                <div className = "removeIconCont">
                    <span className = "removeIcon" title = "Remove Project Resource" onClick = {this.removeIconclick.bind(this)} data-clientid = {window.clientId} data-projid = {window.projectId} data-empid = {this.props.value.employee_id} data-rname = {this.props.editPrefillingValue.name} data-fmid = {this.props.editPrefillingValue.functional_manager_id} data-rrname = {this.props.editPrefillingValue.projects[0].requestedby} data-rremail = {this.props.editPrefillingValue.projects[0].requstorEmail}></span>
                </div>
            </span>
        )
    } 
}