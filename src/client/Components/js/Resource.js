import React, { Component } from "react";
import ReactDOM from 'react-dom';
import '../css/Resource.css'
import {Filter , Tab, HandleFormErrors,renderSuccessPopUp ,MakeAjax, SwitchFunction} from './utils/util';
import staticTxtObj from '../static/text.json';
import Cookies from 'js-cookie';
class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {data: "", userId : Cookies.get('userId') , pancakeData :  Cookies.get('pancakeData') ? JSON.parse(Cookies.get('pancakeData')) : ""};
        this.getResources = this.getResources.bind(this);
    }
    getResources(filterObj) {
        var config = {};
        let employee_id = this.state.userId || "";
        filterObj = filterObj ? filterObj : {};
        let successCbk = function(data) {
            if(data && data.status && data.status.toLowerCase() === "success" && data.message && data.data) {
                ReactDOM.render(<ResourceTableBody  bodydata = {data.data.functionalResources ? data.data.functionalResources : []}  headerData = {staticTxtObj && staticTxtObj.ResourceHeaderDataValue ? staticTxtObj.ResourceHeaderDataValue : ""}  columns = {staticTxtObj && staticTxtObj.ResourceHeaderDataColumnValue ? staticTxtObj.ResourceHeaderDataColumnValue : ""}/>,document.getElementById('switchTabsContainer'));
            }
        }
        let errorCbk = function(data) {
            console.log(data);
        }
        config.postData = {employee_id ,"filters": [filterObj]};
        config.method = "post";
        config.apiUrl = "http://localhost:4000/resources/check-resource-availability";
        config.scbk = successCbk;
        config.ecbk = errorCbk;
        MakeAjax(config);
    }
    render() {
        return(
            <div className = "resourceLandingPage">
                <div id="hrmaincontainer" className = "hrmaincontainer">
                    <Filter value = {staticTxtObj && staticTxtObj.resourceFilter ? staticTxtObj.resourceFilter : []} cbk={this.getResources} id="resourceFilter"/>
                    <div className = "errorDom" id = "errorDom"></div>
                    <div className = "TableContainer">
                        <div id = "tabTopcontainer">
                            <Tab value = {staticTxtObj && staticTxtObj.resoureLandingTab ? staticTxtObj.resoureLandingTab : []} trigger = {true} defaultSelect =  "my_resource"/>
                        </div>
                        <div id = "switchTabsContainer"></div>
                    </div>
                </div>
                {/*!this.props.triggerNavigation ?
                <Navigation value = {this.state.pancakeData && this.state.pancakeData.redirectData ? this.state.pancakeData.redirectData : []}/>
                :""*/}
            </div>
        )
    }
}
export class ResourceTableBody extends Component
{
    constructor(props) {
        super(props);
        this.state = {activePage: 1, bodydata: this.props.bodydata ? this.props.bodydata: ""};
    }
    render() {
        this.state["bodydata"] = this.props.bodydata;
        var thisObj = this;
        return(
            <div className="resource_table"> 
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
                                return bodydata.projects && bodydata.projects.length ? bodydata.projects.map(function(row, key){
                                    return(
                                        <tr key={key}>
                                            {
                                                thisObj.props.columns.map(function(column , index){
                                                    return(
                                                        bodydata.projects.length > 1 && key === 0 && (column === "name") ?
                                                        <td key = {index} rowSpan={bodydata.projects.length}>
                                                            {bodydata.name.replace("|"," ")}
                                                        </td>
                                                        :  bodydata.projects.length > 1 && key === 0 && (column === "employee_id") ? 
                                                        <td key = {index} rowSpan={bodydata.projects.length}>
                                                            {bodydata.employee_id}
                                                        </td>
                                                        :  bodydata.projects.length > 1 && key === 0 && (column === "experience") ? 
                                                        <td key = {index} rowSpan={bodydata.projects.length}>
                                                            {bodydata.experience}
                                                        </td> 
                                                        :  bodydata.projects.length > 1 && key === 0 && (column === "designation") ? 
                                                        <td key = {index} rowSpan={bodydata.projects.length}>
                                                            {bodydata.designation}
                                                        </td> 
                                                        : (column === "name") && key === 0?
                                                        <td key = {index} >
                                                            {bodydata.name.replace("|"," ")}
                                                        </td>
                                                        : column === "employee_id" && bodydata.projects.length < 2 ?
                                                        <td key = {index}>
                                                            {bodydata.employee_id}
                                                        </td>
                                                        : column === "experience" && bodydata.projects.length < 2?
                                                        <td key = {index}>
                                                            {bodydata.experience}
                                                        </td>
                                                        : column === "designation" && bodydata.projects.length < 2?
                                                        <td key = {index}>
                                                            {bodydata.designation}
                                                        </td>
                                                        : column === "employee_id" && bodydata.projects.length === 0 ?
                                                        <td key = {index}>
                                                            {bodydata.employee_id}
                                                        </td>
                                                        : column === "experience" && bodydata.projects.length === 0?
                                                        <td key = {index}>
                                                            {bodydata.experience}
                                                        </td>
                                                        : column === "designation" && bodydata.projects.length === 0 ?
                                                        <td key = {index}>
                                                            {bodydata.designation}
                                                        </td>
                                                        : column === "duration" ?
                                                        <td key={index}>
                                                            {row.start_date} - {row.end_date}
                                                        </td>
                                                         : column === "status" && row[column] === "pending" ?
                                                         <td className = "pendingstatus" key={index}>
                                                              {row[column]}
                                                         </td>
                                                        : column === "status" && row[column] === "approved" ?
                                                        <td className = "inprogressstatus" key={index}>
                                                            In Progress
                                                        </td>
                                                        : column === "project_name" || column === "allocation"?
                                                        <td key = {index}>
                                                        {row[column]}
                                                        </td>
                                                        :""
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                }) :
                                <tr key={mainIndex}>
                                    {     
                                        thisObj.props.columns.map(function(column , index){
                                            return(
                                                column === "name"?
                                                <td key = {index} >
                                                    {bodydata[column].replace("|"," ")}
                                                </td> :
                                                (column === "project_name" || column === "allocation" || column === "duration") ? <td>N/A</td> : 
                                                <td key = {index}>
                                                    {bodydata[column]}
                                                </td>
                                            )})
                                    }</tr>
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
export class ResourceRequestTableBody extends Component
{
    constructor(props) {
        super(props);
        this.state = {activePage: 1, bodydata: this.props.bodydata ? this.props.bodydata: "" , userId : Cookies.get('userId') };
        this.approveRequest = this.approveRequest.bind(this);
        this.denyRequest = this.denyRequest.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
    }
    makeRequest(elem , tocallFlag)
    {
        if(elem)
        {
            var config = {};
            config.postData = {};
            config.postData.employee_id = elem.target ? elem.target.getAttribute("empid") : "";
            config.postData.project_id = elem.target ? elem.target.getAttribute("project_id") : "";
            config.postData.rrName = elem.target ? elem.target.getAttribute("data-rrname") : "";
            config.postData.rrEmail = elem.target ? elem.target.getAttribute("data-rremail") : "";
            config.postData.rName = elem.target ? elem.target.getAttribute("data-rname") : "";
            config.postData.functional_manager_id = this.state.userId;
            config.postData.toCall = tocallFlag;
            let successCbk = function(data) {
                if(data && data.status && data.status.toLowerCase() === "success" && data.message && data.message[0]) {
                    renderSuccessPopUp(data.message);
                    SwitchFunction('resource_requested' , '', '', '', '','');
                }
               else
                {
                    ReactDOM.render(<HandleFormErrors  value = {data.message ? data.message : ["An Error Occurred"] }/>,document.getElementById('errorDom'));    
                }
            }
            let errorCbk = function(data) {
                console.log(data);
            }
            //config.postData = {"employee_id" : empid , "functional_manager_id" : functional_manager_id , "project_id" :  project_id , "toCall" : tocallFlag};
            config.method = "put";
            config.apiUrl = "//localhost:4000/resources/modifyPendingRequests";
            config.scbk = successCbk;
            config.ecbk = errorCbk;
            MakeAjax(config);
        }
    }
    approveRequest(elem)
    {
        this.makeRequest(elem , "approveRequest");
    }
    denyRequest(elem)
    {
        this.makeRequest(elem , "denyRequest");
    }
    render() {
        this.state["bodydata"] = this.props.bodydata;
        var thisObj = this;
        return(
            <div className="resource_table"> 
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
                                return bodydata.pendingData && bodydata.pendingData.length && bodydata.pendingData.map(function(row, key){
                                    return(
                                        <tr key={key}>
                                            {
                                                thisObj.props.columns.map(function(column , index){
                                                    return(
                                                        bodydata.pendingData.length > 1 && key === 0 && (column === "name") ? 
                                                         <td key = {index} rowSpan={bodydata.pendingData.length}>
                                                         {bodydata.name}
                                                        </td> 
                                                        : bodydata.pendingData.length > 1 && key === 0 && (column === "employee_id") ? 
                                                        <td key = {index} rowSpan={bodydata.pendingData.length}>
                                                        {bodydata.employee_id}
                                                        </td> 
                                                        : (column === "name") && key === 0?
                                                         <td key = {index} >
                                                             {bodydata.name}
                                                        </td>
                                                        : (column === "employee_id") && key === 0?
                                                        <td key = {index} >
                                                            {bodydata.employee_id}
                                                        </td>
                                                       : column === "duration" ?
                                                        <td key={index}>
                                                            {row.start_date} - {row.end_date}
                                                        </td>
                                                        : column === "actions" ?
                                                            <td> 
                                                                <span empid = {bodydata.employee_id} project_id = {row.projectId} data-rname = {bodydata.name} data-rrname = {row.requestedby ? row.requestedby : ""} data-rremail = {row.requstorEmail ? row.requstorEmail : ""} className = "approveResource" onClick = {thisObj.approveRequest.bind(this)}></span> 
                                                                <span empid = {bodydata.employee_id} project_id = {row.projectId} data-rname = {bodydata.name} data-rrname = {row.requestedby ? row.requestedby : ""} data-rremail = {row.requstorEmail ? row.requstorEmail : ""} onClick = {thisObj.denyRequest.bind(this)} className = "cancelResource"></span>
                                                            </td>
                                                        : row[column] ?
                                                        <td key = {index}>
                                                        {row[column]}
                                                        </td>
                                                        :""
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            })
                        : 
                        this.props.bodydata === undefined || this.props.bodydata.length === 0?
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
export default Resource;