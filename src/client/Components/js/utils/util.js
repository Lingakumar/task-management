import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import staticTxtObj from '../../static/text.json';
import Picky from "react-picky";
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
//import DatePicker from 'react-date-picker';
import dateFormat from 'dateformat';
//import AddResource from '../AddResource'
import {AddResource, Exit ,  EditResource} from '../Hr';
import {ResourceTableBody , ResourceRequestTableBody} from '../Resource';
import {ProjectsPage, AddProject, AddProjectResource, AddProjectResourceCost, InvalidProject, ResourceAction, DmLanding} from '../Dm';
import Pagination from "react-js-pagination";
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import range from "lodash/range";

export class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {resources: this.props.value, fieldvalues: {}};
        this.filterSearch = this.filterSearch.bind(this);
        this.handleInputValues = this.handleInputValues.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }
    handleInputValues(values)
    {
        if(values.target) {
            let id = values.target.id === "emp_id" ? "employee_id" : values.target.id; 
            values.target.value ? this.state.fieldvalues[id] = values.target.value : delete this.state.fieldvalues[id];
        }
        else {
            if(values.value === "Select...") {
                delete this.state.fieldvalues[values.id];    
            }
            else if(values.value !== "") {
                this.state.fieldvalues[values.id] = values.value;
            }
        }
    }
    filterSearch(event){
        event.preventDefault();
        var filterObj = this.state.fieldvalues;
        if(Object.keys(filterObj).length !== 0 && !this.props.cbk) {
            SwitchFunction("view_/_update_profile", null, filterObj, 1 , '','');
        }
        else if(Object.keys(filterObj).length !== 0){
            this.props.cbk(filterObj)
        }
        else
        {
            let data = [];
            let message = ["Please select at least one filter"];
            data.message = message;
            let errorDom = document.getElementById('errorDom') ? document.getElementById('errorDom') : document.getElementById('formErrorCont');
            if(errorDom)
            {
                ReactDOM.render(<HandleFormErrors value = {data.message}/>,errorDom)
            }
        }
    }
    resetFilter(event) {
        event.preventDefault();
        if(Object.keys(this.state.fieldvalues).length)
        {
            document.getElementById(this.props.id).reset();
            this.setState({fieldvalues: {}});
            if(!this.props.cbk) {
                SwitchFunction("view_/_update_profile", null, {}, 1 , '','');
            }
            else {
                if(document.getElementById("dmResourceFilter")) {
                    ReactDOM.render(<MultiselectDropdown cbk = {this.handleInputValues} value = {staticTxtObj.skills} allData = {[]}/>,document.getElementsByClassName('multiSelectParent')[0]);
                }
                this.props.cbk();
            }
        }
    }
    render() {
        let localvalue = this.state.resources ? this.state.resources : [];
        let id = this.props.id ? this.props.id : "filter";
        var thisObj = this;
        return(
            <form id={id} action = "#">
                <div className = "filterCont">
                    <h4 className = "filterTitle"> Filter Section</h4>
                    {
                        localvalue.map(function(localvalue, index){
                            (localvalue.key === "Designation" ? localvalue.values = staticTxtObj.designation : (localvalue.key === "Department" ?  localvalue.values = staticTxtObj.department : (localvalue.key === "Experience" ?  localvalue.values = staticTxtObj.experience : "")))
                            return(
                                <div className = "filterRowCont" key = {index}>
                                    <div className = "filterKeyVal filterKey">{localvalue.key} :</div>
                                    <div className = {'filterKeyVal filterVal '+ ((localvalue && localvalue.value && (localvalue.value === "MultiselectDropdown" || localvalue.value === "MultiselectDropdown_Skills")) ? "multiSelectParent" :"" )}> 
                                        {
                                            localvalue.value === "input" ? 
                                                <input id = {localvalue.id} className = {'valueInput ' + localvalue.class}  placeholder = "Type Here" onBlur = {thisObj.handleInputValues}></input> :
                                            localvalue.value === "MultiselectDropdown_Skills" ?
                                                <MultiselectDropdown cbk = {thisObj.handleInputValues} value = {staticTxtObj.skills}/> : 
                                            localvalue.value === "MultiselectDropdown" ?
                                                <MultiselectDropdown cbk = {thisObj.handleInputValues}/> :
                                            localvalue.value === "select" ?
                                                 <SelectDropdown cbk = {thisObj.handleInputValues} value = {localvalue} id = {localvalue.id}/> :
                                            localvalue.value === "date" ?
                                                    localvalue.id === "start_date" ?
                                                    <DatePickerComponent cbk = {thisObj.handleInputValues} data = {{"isRequired":true,"id":localvalue.id , value : thisObj.props.data && thisObj.props.data.calendarStart ? thisObj.props.data.calendarStart : ""}} />
                                                :
                                                    localvalue.id === "end_date" ?
                                                    <DatePickerComponent cbk = {thisObj.handleInputValues} data = {{"isRequired":true,"id":localvalue.id , value : thisObj.props.data && thisObj.props.data.calendarEnd ? thisObj.props.data.calendarEnd : ""}} />
                                                :
                                                    <DatePickerComponent cbk = {thisObj.handleInputValues} data = {{"isRequired":true,"id":localvalue.id }} /> 
                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className = "filterBtnCont">
                        <span className = "resetcontainer">
                            <button className = "filterBtn" type="reset" onClick={this.resetFilter}>Reset</button>
                        </span>
                        <span className = "applycontainer">
                            <button className = "filterBtn" type="submit" onClick={this.filterSearch}>Apply</button>
                        </span>
                    </div>
                </div>
            </form>
        )
    }
}
export class MultiselectDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {resourcesvalue:this.props.value , isRequired : (this.props.allData && this.props.allData.isRequired) ? this.props.allData.isRequired : "" , value : null, arrayValue : (this.props.allData && this.props.allData.value) ? this.props.allData.value : []};
        this.onChange = this.onChange.bind(this);
    }
    onChange(value)
    {
        console.log(value);
        this.setState({ arrayValue: value });
        let valueObj = {"id": "primary_skill","value": value}
        this.props.cbk && this.props.cbk(valueObj);
    }
    componentWillReceiveProps(newProps)
    {
        if(newProps && newProps.allData && newProps.allData.value)
        {
            this.setState({arrayValue : newProps.allData.value})
        }
        else {
            this.setState({arrayValue : []});
        }
    }
    render()
    {    
        let localvalue = this.state.resourcesvalue;
        return <Picky className = {this.state.isRequired ? "reqInput" : ""} placeholder="Select..." disabled = {this.state.isDisabled ? "disabled = disabled" : ""} value={this.state.arrayValue} options={localvalue} open={false} valueKey="label" includeFilter = {false} labelKey="value" multiple={true} dropdownHeight={100} numberDisplayed = {0} onChange={this.onChange.bind(this)}/>;
    }    
}
export class SelectDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {prefilled : this.props.prefilled , resourcesvalue: this.props.value , isDisabled : this.props.isDisabled , selectedValue : ""};
        this.selectChangeAction = this.selectChangeAction.bind(this);
        this.onblurFunc = this.onblurFunc.bind(this);
    }
    selectChangeAction(e)
    {
        let selectedElem = e.target; 
        let selectedVal = selectedElem.value;
        if(selectedVal !== "Select..."){
            selectedElem.classList.remove('errInput')
        }
        this.setState({selectedValue : e.target.value , prefilled  : ""})
    }
    onblurFunc()
    {
        let valueObj = {"id" : this.props.id , "value" : this.state.selectedValue}
        this.props && this.props.cbk(valueObj);
    }
    componentWillReceiveProps(newprops)
    {
        this.setState({resourcesvalue : newprops.value})
        if(newprops.value && newprops.value.class && newprops.value.class.toLowerCase().indexOf("filter") !== -1) {
            this.setState({selectedValue : "Select..."});
        }
        this.setState({prefilled : newprops.prefilled})
    }
    render()
    {  
        let param = this.state.resourcesvalue ? this.state.resourcesvalue : {};
        return(
            <select onBlur = {this.onblurFunc} value = {this.state.prefilled ? this.state.prefilled : this.state.selectedValue} onChange = {this.selectChangeAction} className = {param.className ? (param.isRequired ? "selectDropDown reqInput " + param.className : "selectDropDown " + param.className) : (param.isRequired ? "selectDropDown reqInput "  : "selectDropDown")} disabled = {this.state.isDisabled ? "disabled = disabled" : ""} id = {param.id ? param.id : ""} label = {param.label}>
                {
                    param.values && param.values.length ? 
                    param.values.map(function(values,index){
                        return(
                            <option id = {values} key = {index}>{values}</option>
                        )
                    })
                    : ""
                }
            </select>
        )  
        
    }    
}
export class RenderPopup extends Component{
    constructor(props)
    {
        super(props);
        this.state = {};
        this.closePopup = this.closePopup.bind(this);
    }
    closePopup(){
        document.getElementById("popupContainer").classList.remove("view_profile");
        document.getElementsByClassName('backroundMask')[0].classList.add("hideContainer");
    }
    render()
    {
        var thisObj = this;
        thisObj.state = {formData: thisObj.props.value, popupName:thisObj.props.popupName,successValue : thisObj.props.successValue};
        document.getElementsByClassName('backroundMask')[0].classList.remove("hideContainer");
        let formdata = this.state.formData && this.state.formData.data ? this.state.formData.data : "";
        let viewresourceOrder = staticTxtObj.viewResourceOrder;
        let successValue = thisObj.state.successValue ? thisObj.state.successValue : "";
        let name = formdata && formdata["name"] ? formdata["name"].replace("|"," ") : "";
        return(
            <div className = "popupInnerCont">
                <div className = "popupHeaderCont">
                    <h3 className = "popupHeader">{thisObj.state.popupName === "Viewing Profile" ? `Viewing ${name}'s Profile` : thisObj.state.popupName}  </h3>
                    <div className = "popupClose" onClick = {thisObj.closePopup}></div>
                </div>
                {formdata === "" ? 
                    <div className = "successValue"> 
                        {
                            successValue ? successValue.map(function(data,key){
                                return(
                                    <div className = "successPopup" key = {key}>{data}</div>           
                                )
                            }) : ""
                        }
                    </div>     
                    :
                    <div className="body_container"> 
                        <table className="table">
                            <tbody className = "table_body">
                                {thisObj.state.popupName &&  thisObj.state.popupName !== "Error" ? 
                                    viewresourceOrder.map(function(id,key){
                                        return(
                                                <tr key = {key}>
                                                        <td className = "labelName"><span>{id.replace(new RegExp("_", 'g')," ")}</span></td>
                                                        <td className = "value">
                                                            <span>
                                                                {Array.isArray(formdata[id]) ? formdata[id].map(function(innerval , key) { return (formdata[id].length === key+1 ? innerval.value : innerval.value + ",")} ) : id === "name" ? formdata[id].replace("|"," ") : formdata[id] ? formdata[id]: "-"}
                                                            </span>
                                                        </td>
                                                </tr> 
                                                                            
                                        )
                                    })
                                    : <tr className = "error">{formdata[0].Value}</tr>
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        )
    }
}
export class DatePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.formateDate = this.formateDate.bind(this);
        this.datePickerPosition = this.datePickerPosition.bind(this);
        this.state = {
            date: this.props && this.props.data && this.props.data.value ? new Date(this.props.data.value) : new Date(),
            isRequired : this.props.isRequired
          };
    }
    componentDidMount(prevProps , props)
    {
        let valueObj = {"id": (this.props.data && this.props.data.id ) ? this.props.data.id : this.props.id ? this.props.id : "dateValue" ,"value" : this.props.data.value ? this.formateDate(this.props.data.value) : this.formateDate(new Date())}
        this.props.cbk && this.props.cbk(valueObj);
    }
    datePickerPosition(event){
        if(this.props.tableId) {
            setTimeout(()=>{
                let currentElem = document.getElementsByClassName("react-datepicker-popper")[0];
                let tableElem = document.getElementById(this.props.tableId);
                if(tableElem){
                    tableElem.scrollLeft = currentElem && currentElem.getBoundingClientRect().x;
                }
            })
        }
        else {
            console.log("Table Id not found");
        }
    }
    componentWillReceiveProps(newProps)
    {
        if(newProps.data && newProps.data.value)
        {
            this.setState({date : newProps.data.value})
        }
        else {
            this.setState({date : new Date()});
        }
    }
    formateDate(date){
        return dateFormat(date, "mm/dd/yyyy");
    }
    handleChange(date) {
        if(date)
        {
            this.setState({date : date});
        }
        else
        {
            this.setState({date : new Date()});
        }
        let valueObj = {"id": this.props.data ? this.props.data.id : this.props.id ? this.props.id : "dateValue","value":this.formateDate(date)}
        console.log(valueObj);
        this.props.cbk && this.props.cbk(valueObj);
        
    }
    render()
    {
        const years = range(1950, moment().year() + 10, 1);
        const months = moment.months();
        return ( 
            <DatePicker
                className = {this.state.isRequired ? "react-datepicker reqInput" : "react-datepicker" }
                selected= {moment(this.state.date)}
                onChange={this.handleChange}
                id={this.props.data.id}
                onFocus={this.datePickerPosition}
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {"<"}
                      </button>
                      <select
                        value={date.year()}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                       <select
                        value={months[date.month()]}
                        onChange={({ target: { value } }) => changeMonth(value)}
                      >
                        {months.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                       <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
            />
        );
    }
}
export class Tab extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {tabArr: this.props.value , shouldTriggerClick : this.props.trigger};
        this.handleTabAction = this.handleTabAction.bind(this);
        this.addActiveClass = this.addActiveClass.bind(this);
        this.removeActiveClass = this.removeActiveClass.bind(this);
    }
    componentDidUpdate(prevProps , props)
    {
        if(this.props.defaultSelect)
        {
            if(document.getElementById(this.props.defaultSelect) && this.props.shouldTriggerClick)
            {
                document.getElementById(this.props.defaultSelect).click();
            }
            else
            {
                this.removeActiveClass();
                document.getElementById(this.props.defaultSelect).classList.add('active');
            }
        }
    }
    componentDidMount(prevProps , props)
    {
        if(document.getElementById(this.props.defaultSelect))
        {
            if(this.state.shouldTriggerClick)
            {
                document.getElementById(this.props.defaultSelect).click();
            }
            else
            {
                this.removeActiveClass();
                document.getElementById(this.props.defaultSelect).classList.add('active');
            }
        }    
    }
    removeActiveClass()
    {
        const allTabs =  document.querySelector('.tabs.active');
        allTabs && allTabs.classList.remove("active");
    }
    handleTabAction(elem) {
        if(elem)
        {
            const tabs = elem.target;
            this.removeActiveClass();
            tabs.classList.add("active");
            var idValue = tabs.attributes && tabs.attributes.id && tabs.attributes.id.value;
            if(idValue === "assign_/_request_resource") {
                SwitchFunction(idValue , '' , '', '' ,'projectResource', 'availableResource')    
            }
            else {
                SwitchFunction(idValue , '' , '', '' ,'','')
            }
        }
    }
    addActiveClass(value)
    {
        return ((value===this.state.tabActive) ? 'tabs active' : 'tabs');
    }
    render() {
        var thisObj = this;
        return(
            <div className="viewer_tab_container">
            {
                this.props.value.map(function(localvalue, index){
                    return(
                        <span key = {index} className={(localvalue && localvalue.class) ? 'tabs ' + localvalue.class : "tabs"} id = {localvalue.key.replace(new RegExp(" ", 'g'),"_").toLowerCase()} onClick={thisObj.handleTabAction}>{localvalue.key}</span>
                    )
                })
            }
            </div>
        )
    }
}
export class TableBody extends Component {
    constructor(props) {
        super(props);
        this.state = {activePage: 1, bodydata: this.props.bodydata ? this.props.bodydata: "", fieldroleVal : [], fieldallocationVal : [], fieldStartVal : [], fieldEndVal : [] , editStartDate : [] , editEndDate : [] , editRole : [] , editAllocatedPercent : []};
        this.handleInputRoleValues = this.handleInputRoleValues.bind(this);
        this.handleInputallocationValues = this.handleInputallocationValues.bind(this);
        this.handleSendRequest = this.handleSendRequest.bind(this);
        this.handleStartDateValues = this.handleStartDateValues.bind(this);
        this.handleEndDateValues = this.handleEndDateValues.bind(this);
        this.handleeditRole = this.handleeditRole.bind(this);
        this.handleeditAllocatedPercent = this.handleeditAllocatedPercent.bind(this);
        this.handleEditEndDate = this.handleEditEndDate.bind(this);
        this.handleeditRole = this.handleeditRole.bind(this);
        this.handleEditStartDate = this.handleEditStartDate.bind(this);
        this.handleEditSaveAction = this.handleEditSaveAction.bind(this);
    }
    componentWillReceiveProps(){
        if(this.props.bodydata) {
            this.state["bodydata"] = this.props.bodydata;
        }
    }
    handleInputRoleValues(values) {
        let id = values.id;
        this.state.fieldroleVal[id] = values.value;
    }
    handleInputallocationValues(values) {
        let id = values.id;
        this.state.fieldallocationVal[id] = values.value;
    }
    handleStartDateValues(values) {
        let id = values.id;
        this.state.fieldStartVal[id] = values.value;
    }
    handleEndDateValues(values) {
        let id = values.id;
        this.state.fieldEndVal[id] = values.value;
    }
    handleeditRole(e)
    {
        let id = e.id;
        this.state.editRole[id] = e.value;
    }
    handleEditEndDate(e)
    {
        let id = e.id;
        this.state.editEndDate[id] = e.value;
    }
    handleEditStartDate(e)
    {
        let id = e.id;
        this.state.editStartDate[id] = e.value;
    }
    handleeditAllocatedPercent(e)
    {
        let id = e.id;
        this.state.editAllocatedPercent[id] = e.value;
    }
    handleEditSaveAction(elem)
    {
        var thisObj = this;
        let targetElem = elem.target;
        let config = {}
        let postData = {};
        let errArray = [];
        let index = parseInt(targetElem.getAttribute("index"));
        postData.client_id = window.clientId ? window.clientId : errArray.push("Client Id can't be empty");
        postData.project_id = window.projectId ? window.projectId : errArray.push("Project Id can't be empty");
        postData.employee_id = targetElem.getAttribute("data-empid") != null ? targetElem.getAttribute("data-empid") : errArray.push("Employee Id can't be empty");
        postData.role = thisObj.state.editRole["EditRequestrole"+index] ? thisObj.state.editRole["EditRequestrole"+index] : errArray.push("Role can't be empty");
        postData.rName = targetElem.getAttribute("data-rname") != null ? targetElem.getAttribute("data-rname") : "";
        postData.fmId = targetElem.getAttribute("data-fmid") != null ? targetElem.getAttribute("data-fmid") : "";
        postData.rrName = targetElem.getAttribute("data-rrname") != null ? targetElem.getAttribute("data-rrname") : "";
        postData.rEmail = targetElem.getAttribute("data-remail") != null ? targetElem.getAttribute("data-remail") : "";
        let start_date = thisObj.state.editStartDate["EditStartDate"+index] ;
        let end_date = thisObj.state.editEndDate["EditEndDate"+index] ;
        postData.allocation = thisObj.state.editAllocatedPercent["editAllocatedPercent"+index] ? thisObj.state.editAllocatedPercent["editAllocatedPercent"+index] : errArray.push("Allocated Percentage can't be empty");
        if(start_date === end_date){
            errArray.push("Start Date and End Date can't be same");
        }
        else{
            postData.start_date = start_date;
            postData.end_date = end_date;
        }
        if(errArray.length){
            ReactDOM.render(<HandleFormErrors value = {errArray}/>,document.getElementById('errorDom'));
        }
        else{
            config.apiUrl = "http://localhost:4000/resources/update-resource-info";
            config.method = "put";
            config.postData = postData;
            config.scbk = function(data)
            {
                if(data.status === "Success"){
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
                        SwitchFunction('assign_/_request_resource','','','','projectResource', 'availableResource');
                        document.getElementsByClassName('backroundMask')[0].classList.add("hideContainer");
                        clearInterval(rerenderResourceRequest);
                    }, 3000);
                    
                }
                else{
                    console.log("error");
                    if(data && data.message){
                        ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                    }
                }
            };
            config.ecbk = function(data)
            {
                console.log("error");
                if(data && data.message){
                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                }
            };
            MakeAjax(config);
        }
    }
    handleSendRequest(elem){
        var thisObj = this;
        let targetElem = elem.target;
        let config = {}
        let postData = {};
        let errArray = [];
        let index = parseInt(targetElem.getAttribute("index"));
        postData.client_id = targetElem.getAttribute("data-clientid") != null ? targetElem.getAttribute("data-clientid") : errArray.push("Client Id can't be empty");
        postData.project_id = targetElem.getAttribute("data-projid") != null ? targetElem.getAttribute("data-projid") : errArray.push("Project Id can't be empty");
        postData.employee_id = targetElem.getAttribute("data-empid") != null ? targetElem.getAttribute("data-empid") : errArray.push("Employee Id can't be empty");
        postData.name = targetElem.getAttribute("data-name") != null ? targetElem.getAttribute("data-name") : errArray.push("Employee Name can't be empty");
        postData.role = thisObj.state.fieldroleVal["role"+index] ? thisObj.state.fieldroleVal["role"+index] : errArray.push("Role can't be empty");
        postData.allocation = thisObj.state.fieldallocationVal["requestPercent"+index] ? thisObj.state.fieldallocationVal["requestPercent"+index] : errArray.push("Allocation % can't be empty");
        let start_date = thisObj.state.fieldStartVal["startDate"+index];
        let end_date = thisObj.state.fieldEndVal["EndDate"+index];
        if(start_date === end_date){
            errArray.push("Start Date and End Date can't be same");
        }
        else{
            postData.start_date = start_date;
            postData.end_date = end_date;
        }
        if(errArray.length){
            ReactDOM.render(<HandleFormErrors value = {errArray}/>,document.getElementById('errorDom'));
        }
        else{
            config.apiUrl = "http://localhost:4000/resources/allocate-project";
            config.method = "post";
            config.postData = postData;
            config.scbk = function(data)
            {
                if(data.status === "Success"){
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
                        SwitchFunction('assign_/_request_resource','','','','projectResource', 'availableResource');
                        document.getElementsByClassName('backroundMask')[0].classList.add("hideContainer");
                        clearInterval(rerenderResourceRequest);
                    }, 3000);
                    
                }
                else{
                    console.log("error");
                    if(data && data.message){
                        ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                    }
                }
            };
            config.ecbk = function(data)
            {
                console.log("error");
                if(data && data.message){
                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                }
            };
            MakeAjax(config);
        }
    }   
     render() {
        this.state["bodydata"] = this.props.bodydata;
        var thisObj = this;
        if(this.props.pagination) {
            var totalCount = this.props.pagination.total ? this.props.pagination.total : 0;
            var limit = this.props.pagination.limit ? this.props.pagination.limit : 0;
            var page = this.props.pagination.page ? this.props.pagination.page : 1;
        }
        var filterObj = this.props.filterObj;
        let id = this.props.id ? this.props.id : ""
        return(
            <div className="resource_table" id={id}> 
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
                                if(thisObj.props.bodydata.projectStart_date && thisObj.props.bodydata.projectEnd_date)
                                {
                                    thisObj.state.fieldStartVal["startDate"+index] = thisObj.props.bodydata.projectStart_date;
                                    thisObj.state.fieldEndVal["EndDate"+index] = thisObj.props.bodydata.projectEnd_date;
                                }
                                if(thisObj.props.id && thisObj.props.id === "editResourceAction")
                                    {
                                        if(row.resourceRole)
                                        {
                                            thisObj.state.editRole["EditRequestrole"+index] = row.resourceRole;
                                        }
                                        if(row.resourceAllocatedPercent)
                                        {
                                            thisObj.state.editAllocatedPercent["editAllocatedPercent"+index] = row.resourceAllocatedPercent;
                                        }
                                    }
                                return(
                                    <tr key = {index}>
                                        {
                                            thisObj.props.columns.map(function(column , key){
                                                return(
                                                    <td key = {key}>
                                                        {
                                                            (column === "primary_skill" || column === "secondary_skills") ? <ListMenu data = {row[column]} headerName = {"View"}/>
                                                            : column === "actions" ? <EditViewIcon empid = {row.employee_id} />
                                                            : column === "no" ? index + 1 
                                                            : column === "reqresource" && !row.projects ? <span onClick = {thisObj.handleSendRequest} id = {"reqAction_" + index} index = {index} className = "reqAction" data-clientid = {thisObj.props.bodydata.clientId} data-projid = {thisObj.props.bodydata.projectId} data-empid = {row.employee_id} data-name = {row.name}>Send Request</span>
                                                            : column === "reqresource" && row.projects? <span index = {index} className = "reqAction assigned">Request Sent</span> 
                                                            : column === "reqResourceStartDate" ? <DatePickerComponent data = {{"isRequired":true,"id":"startDate"+ index , value : thisObj.props.bodydata.projectStart_date ? thisObj.props.bodydata.projectStart_date : ""}} cbk={thisObj.handleStartDateValues} tableId={id}/>
                                                            : column === "reqResourceEndDate" ? <DatePickerComponent data = {{"isRequired":true,"id":"EndDate"+ index , value : thisObj.props.bodydata.projectEnd_date ? thisObj.props.bodydata.projectEnd_date : ""}} cbk={thisObj.handleEndDateValues} tableId={id}/>
                                                            : column === "reqResourceRole" ?  <SelectDropdown id = {"role"+ index} value = {staticTxtObj.role} cbk={thisObj.handleInputRoleValues}/> 
                                                            : column === "reqResourceAllocatedPercent" ? <Input data = {{"isRequired":true,"id":"requestPercent"+ index,"sub_type":"number"}} cbk={thisObj.handleInputallocationValues}/> 
                                                            : column === "availablePercentage" ?  row[column] 
                                                            : column === "resourceAction" && !row[column]  ? getprivelage("client_edit") ? <ResourceAction editPrefillingValue = {row} value = {{"employee_id":row.employee_id}}/> :"N/A"
                                                            : column === "resourceRole" && row[column] !== "" && row.resourceAction && row.resourceAction === "editAction"? <SelectDropdown id={"EditRequestrole"+ index} value = {staticTxtObj.role} prefilled = {row.resourceRole} cbk={thisObj.handleeditRole}/>
                                                            : column === "resourceAllocatedPercent" && row[column] !== "" && row.resourceAction && row.resourceAction === "editAction" ? <Input data = {{"isRequired":true,"id":"editAllocatedPercent"+ index,"sub_type":"number", "value": row.resourceAllocatedPercent}} cbk={thisObj.handleeditAllocatedPercent}/>
                                                            : column === "resourceStartDate" && row[column] !== "" && row.resourceAction && row.resourceAction === "editAction" ? <DatePickerComponent data = {{"isRequired":true,"id":"EditStartDate"+ index, "value": row.resourceStartDate}} cbk={thisObj.handleEditStartDate} tableId={id}/>
                                                            : column === "resourceEndDate" && row[column] !== "" && row.resourceAction && row.resourceAction === "editAction" ? <DatePickerComponent data = {{"isRequired":true,"id":"EditEndDate"+ index, "value": row.resourceEndDate}} cbk={thisObj.handleEditEndDate} tableId={id}/>
                                                            : column === "resourceAction" && row[column]  ? <span title = "Save" className = "saveIcon" index = {index} data-clientid = {thisObj.props.bodydata.clientId} data-projid = {thisObj.props.bodydata.projectId} data-empid = {row.employee_id} data-rname = {row.name} data-remail = {row.email_id} data-fmid = {row.functional_manager_id} data-rrname = {row.projects[0].requestedby} data-rremail = {row.projects[0].requstorEmail} onClick = {thisObj.handleEditSaveAction}></span>
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
                {
                   this.props.pagination && this.props.bodydata && this.props.bodydata.length ? 
                        <NewPagination limit = {limit} totalCount = {totalCount} page = {page} filterData = {filterObj} isFrom = {this.props.isFrom ? this.props.isFrom : ""}/>
                    : ""
                }
            </div>
        )
    }
}
export class NewPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {activePage: this.props.page};
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    handlePageChange(pageNumber){
        if(this.props.isFrom && this.props.isFrom === "projectResource") {
            SwitchFunction("assign_/_request_resource", null, null, pageNumber , this.props.isFrom,'');
        }
        else if(this.props.isFrom && this.props.isFrom === "availableResource") {
            SwitchFunction("assign_/_request_resource", null, null, pageNumber , null, this.props.isFrom);
        }
        else {
            SwitchFunction("view_/_update_profile", null, this.props.filterData, pageNumber , '','');
        }
        this.setState({activePage: pageNumber});
    }
    componentWillReceiveProps(){
        this.setState({activePage: this.props.page});
    }
    render() {
        return (
            <div className="paginationCont">
                <Pagination
                    activePage={this.props.page}
                    itemsCountPerPage={this.props.limit}
                    totalItemsCount={this.props.totalCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                />
            </div>
        )
    }
}
class EditViewIcon extends Component
{
    constructor(props , context)
    {
        super(props , context);
        this.editIconClick = this.editIconClick.bind(this);
        this.viewIconclick = this.viewIconclick.bind(this);
    }
    viewIconclick(elem)
    {
        SwitchFunction('view_profile' , elem.target.getAttribute('empid') , '', '' ,'','')
    }
    editIconClick(elem)
    {
        let modifiedArray = [{"key":"Edit Resource","isActive":true}, {"key":"View / Update Profile","isActive":true}, {"key":"Exit","isActive":true}];
        ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "edit_resource"/>,document.getElementById('tabTopcontainer'));
        SwitchFunction('edit_profileByViewing' , elem.target.getAttribute('empid') ,'' ,'' , '','')
    }
    render()
    {
        return(
            <span>
                <div className = "viewIconCont">
                    <span empid = {this.props.empid} className = "viewIcon" onClick = {this.viewIconclick.bind(this)}></span>
                </div>
             {getprivelage("resource_edit") ?
                <div className = "editIconCont">
                    <span empid = {this.props.empid} className = "editIcon" onClick = {this.editIconClick.bind(this)}></span>
                </div>
            :""}
            </span>
        )
    } 
}
export class ListMenu extends Component {
    constructor(props)
    {
        super(props);
        this.state = {headerName : this.props.headerName}
        this.showMenu = this.showMenu.bind(this);
    }
    showMenu(elem)
    {
        var curElem = elem.target;
        maskFunction(curElem);
        curElem.nextSibling.classList.add('showMenu');
    }
    render()
    {
        var thisObj = this;
        if(this.props.data && this.props.data.length)
        {
            return(
                <React.Fragment>
                <div className = "menuContainer">
                    <div className = "headerText" onClick = {this.showMenu}>{this.state.headerName}</div>
                    <div id = "menuList" className = "listDataCont">
                    {
                        thisObj.props.data.map(function(list , index){
                            return(
                                <div className = "menuList" key = {index} >{list.value ? list.value : ""}</div> 
                            )
                        })
                    }
                    </div>
                </div>
                </React.Fragment>)
        }
        else {
            return "-";
        }
    }
}
export function removeClass (toRemoveClass , selectorClassName)
    {
        var className = document.getElementsByClassName(selectorClassName);
        var classNameLen = className.length;
        for(let i=0; i < classNameLen; i++)
        {
            className[i].classList.remove(toRemoveClass);
        }
}
export function maskFunction(curElem)
{
    if(document.getElementById('maskContainer') && document.getElementById('maskContainer').classList.contains('hideContainer'))
    {
        document.getElementById('maskContainer').classList.remove('hideContainer');
    }
    else if(document.getElementById('maskContainer'))
    {
        document.getElementById('maskContainer').classList.add('hideContainer');
        removeClass('showMenu' , 'listDataCont');
    }
}
export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {isDisabled : this.props.isDisabled , skills: staticTxtObj.skills, id: this.props.id, fieldvalues: {}};
        //this.handleReset = this.handleReset.bind(this);
        this.handleSubmitAction = this.handleSubmitAction.bind(this);
        this.handleInputValues = this.handleInputValues.bind(this);
        this.handleCancelAction = this.handleCancelAction.bind(this);
        this.handleResetAction = this.handleResetAction.bind(this);
    }
    handleSubmitAction(event){
        event.preventDefault();
        let _self = this;
        var fieldValues = _self.state.fieldvalues;
        if(this.state.id){
            if(this.state.id === "addresoruce_form"){
                AddResource.addHrResoursefn(fieldValues , this.handleResetAction);
            }
            else if(this.state.id === "editresource_form")
            {
                EditResource.editResourcefn(fieldValues);
            }
            else if(this.state.id === "exitResoruce_form"){
                Exit.exitHrResoursefn(fieldValues);
            }
            else if(this.state.id === "addProjBasic_form"){
                AddProject.addProjBasicDetailsfn(fieldValues);
            }
            else if(this.state.id === "addSubproject")
            {
                AddProject.addSubprojectfn(fieldValues);
            }
        }    
    }
    handleCancelAction(event){
        event.preventDefault();
        ReactDOM.render(<DmLanding makeCall = {true}/>,document.getElementById('mainContainer'));
    }
    handleResetAction(event) {
        event.preventDefault();
        this.props.data.map(formData => {
            formData.data.map(data => {
                if(data.type === "select") {
                    data.value = "Select...";
                }
                else {
                    data.value && delete data.value;
                    data.isDisabled && delete data.isDisabled;
                }
            })
        })
        //document.getElementById(this.props.id).reset();
        this.forceUpdate();
    }
    handleInputValues(values) {
        let id = values.id;
        this.state.fieldvalues[id] = values.value;
        if(this.state.id && this.state.id === "exitResoruce_form" && values.id && values.id === "emp_id" && values.value !== (window.previousEmpid ? window.previousEmpid : ""))
        {
            window.previousEmpid = values.value
            Exit.prefillData(values);
        }
    }
    render() {
        var thisObj = this;
        let formData = this.props.data ? this.props.data : "";
        let skills = this.state.skills;
        let id = this.state.id ? this.state.id : "form";
        return(
            <form id={id} action = "#">
            {
            formData.length ? 
                 formData.map(function(data,key){
                return (
                    <div key = {key}>
                        <div id = "formErrorCont" className = "formErrorCont"></div>
                        <div id={data.id ? data.id : "id"+key} className={data.className ? "info_container " + data.className : "info_container"}>
                            {
                                data.title ?
                                    <div className="title_container">
                                        <div className="title">{data.title}</div>
                                    </div>
                                :""
                            }
                            <div className="body_container">
                                {
                                    data.data.map(function(entry,index){
                                        thisObj.state.fieldvalues[entry.id] = entry.value ? entry.value : "";
                                        entry.label === "Designation" ? entry.values = staticTxtObj.designation : (entry.label === "Department" ? entry.values = staticTxtObj.department : (entry.label === "Experience" ? entry.values = staticTxtObj.experience : ""))
                                        return(
                                            <div key = {index} id={entry.id ? entry.id : "id" + index} className= {entry.className ? "elem_container " + entry.className : "elem_container"}>
                                            <span className="label_name">{entry.label} {entry.isRequired ? <span className = "reqMark"> * </span> : ""}:</span>
                                                <span className="value_cont">
                                                    {
                                                        
                                                        entry.type === "input" ? 
                                                            <Input data={entry} id = {thisObj.props.id} cbk={thisObj.handleInputValues}/> : 
                                                        entry.type === "checkbox" ? 
                                                            <Checkbox data={entry} cbk={thisObj.handleInputValues}/> : 
                                                        entry.type === "select" ? 
                                                            <SelectDropdown cbk = {thisObj.handleInputValues} prefilled = {entry.value ? entry.value : ""} id = {entry.id} value = {entry}/> : 
                                                        entry.type === "textarea" ? 
                                                            <TextArea data={entry} cbk = {thisObj.handleInputValues}/> : 
                                                        entry.type === "date" ? 
                                                            <DatePickerComponent data = {entry} isRequired = {entry.isRequired} cbk = {thisObj.handleInputValues}/>  : 
                                                        entry.type === "multiselect" && entry.id === "primary_skill" ?
                                                            <MultiselectDropdown allData = {entry} value = {skills} cbk = {thisObj.handleInputValues}/> :
                                                        ""
                                                    }
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            })
            :
            ""
        }
            <div className= {(id === "addProjBasic_form" || id === "addSubproject") ? "addProj_btn_cont btn_cont": "btn_cont"}>
                <div className="submit_cont">
                    <button type="submit" onClick={this.handleSubmitAction}>Submit</button>
                </div>
                <div className="reset_cont">
                    <button onClick = {this.handleResetAction}>Reset</button>
                </div>
                {
                    (id === "addProjBasic_form" || id === "addSubproject") ?
                    <div className="cancel_cont">
                        <button type = "button" onClick={this.handleCancelAction}>Cancel</button>
                    </div>
                    : ""
                }
            </div>
            </form>
        )
    }
}
export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {staticData: this.props.data, value: (this.props.data && this.props.data.value) ? this.props.data.value : "", border: {"border": "1px solid #cccccc"} , id : this.props.id};
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleOnChange(e){
        this.setState({value:e.target.value});
    }
    handleKeyPress(e){
        if (e.target.type === "number"){
            if(e.charCode === 101 || e.charCode === 69) {
                e.preventDefault();
            }
            let maxLength = e.target.getAttribute("maxlength");
            if( maxLength && (e.target.value.length === parseInt(e.target.getAttribute("maxlength")))){
                e.preventDefault();
            }
        }
    }
    handleOnBlur(e){
        let inputElem = e.target;
        let inputValue = inputElem.value;
        if(inputValue === "" && this.state.staticData && this.state.staticData.isRequired) {
            this.setState({border: {"border": "1px solid #ff0000"}});
        }
        else{
            if(inputElem.getAttribute("type") === "email"){
                if((/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).test(inputValue)){
                    this.setState({border: {"border": "1px solid #cccccc"}});
                    inputElem.classList.remove('errInput');
                }
                else{
                    this.setState({border: {"border": "1px solid #ff0000"}});
                }
            }
            else{
                this.setState({border: {"border": "1px solid #cccccc"}});
                inputElem.classList.remove('errInput');
            }
            let valueObj = {"id": (this.state.staticData && this.state.staticData.id), "value": inputValue}
            this.props.cbk && this.props.cbk(valueObj);
        }
    }
    componentWillReceiveProps(newProps , prevstate) {
        this.setState({value: newProps && newProps.data && newProps.data.value ? newProps.data.value : ""})
        this.setState({staticData  : newProps.data ? newProps.data : "",border: {"border": "1px solid #cccccc"}});
    }
    render() {
        let inputData = this.state.staticData;
        return(
            <input 
                className={inputData && inputData.isRequired ? "reqInput valueInput" : "valueInput"} 
                disabled = {inputData.isDisabled ? "disabled = disabled" : ""}
                placeholder = "Type Here" 
                type={inputData && inputData.sub_type ? inputData.sub_type : "text"} 
                required={inputData && inputData.isRequired ? "required" : ""}
                onChange={this.handleOnChange}
                onBlur={this.handleOnBlur}
                style={this.state.border}
                value = {this.state.value}
                minLength = {inputData && inputData.minLength ? inputData.minLength : ""}
                maxLength = {inputData && inputData.maxLength ? inputData.maxLength : ""}
                onKeyPress={this.handleKeyPress}
            />
        )
    }
}
export class TextArea extends Component {
    constructor(props) {
        super(props);
        this.state = {staticData: this.props.data, textareaValue:"", rows: this.props.rows ? this.props.rows: 4, cols: this.props.cols ? this.props.cols: 30};
        this.handleInput = this.handleInput.bind(this);
        this.onblurFunc = this.onblurFunc.bind(this);
    }
    handleInput(e)
    {
        this.setState({textareaValue : e.target.value})
    }
    onblurFunc(e)
    {
        let valueObj = {"id": ((this.state.staticData && this.state.staticData.id) ? this.state.staticData.id : ""), "value": this.state.textareaValue}
        this.props.cbk && this.props.cbk(valueObj);
    }
    componentWillReceiveProps(newProps)
    {
        this.setState({textareaValue : ""})
    }
    render() {
        let textArea = this.state.staticData;
        let row = this.state.rows;
        let col = this.state.cols;
        return(
            <textarea rows={row} cols={col} value = {this.state.textareaValue} onBlur = {this.onblurFunc} onChange = {this.handleInput} className = {textArea.isRequired ? "reqInput" : ""}></textarea>
        )
    }
}
export class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {checked : this.props.data.value ? this.props.data.value : false,staticData: this.props.data && this.props.data.id ? this.props.data.id : "" , value:"", id : this.props.id, textArea : this.props.data};
        this.handleOnChange = this.handleOnChange.bind(this);
        //this.handleOnBlur = this.handleOnBlur.bind(this);
    }
    handleOnChange(e)
    {
        var valueObj = {id: this.props.data.id, "value": e.target.checked}
        this.setState({checked : e.target.checked})
        this.props.cbk && this.props.cbk(valueObj); 
    }
    componentWillReceiveProps(newprops)
    {
        this.setState({textArea : newprops.data})
        this.setState({checked : newprops.data.value ? newprops.data.value : false })
    }
    render() {
        return(
            <div className = "center">
                <input id = "cbx" type = "checkbox"  checked = {this.state.checked} onBlur = {this.handleOnBlur} onChange = {this.handleOnChange} className = {this.props.data && this.props.data.id ? this.props.data.id : ""} style={{"display":"none"}}></input>
                <label htmlFor = "cbx" className="toggle"><span></span></label> 
            </div>
        )
    }
}


export class HandleFormErrors extends Component {
    constructor(props) {
        super(props);
        this.state = {resources : this.props.value};
    }
    componentWillReceiveProps(newProps)
    {
        if(newProps && newProps.value)
        {
            this.setState({resources : newProps.value})
        }
    }
    render() {
        let localvalue = this.state.resources && this.state.resources.length ? this.state.resources : [];
        return(
            <div id = "formErrorInnerCont"  className = "formErrorInnerCont">
                {
                    localvalue.map(function(localvalue, index){
                        return(
                            <div className = "formErrorDom" key = {index}>
                               {localvalue}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
export function MakeAjax(config)
{
    let loadingGaugeCont = document.getElementById('loadingGaugeContainer');
    let errorDom = document.getElementById('errorDom');
    let formError = document.getElementById('formErrorCont');
    if(errorDom) // to remove error
    {
        ReactDOM.unmountComponentAtNode(errorDom);
    }
    if(formError)
    {
        ReactDOM.unmountComponentAtNode(formError);
    }
    loadingGaugeCont.style.display = "Block";
    axios({
        method: config.method,
        url: config.apiUrl,
        data: config.postData ? config.postData : "",
        withCredentials : true,
        config: { headers: {'Content-Type': 'application/json' }},
        credentials: 'same-origin'
    })
    .then((response) => {
        loadingGaugeCont.style.display = "none";
        if(response && response.data && response.data.status)
        {
            return(config.scbk(response.data));
        }
    })
    .catch(function (response) {
        loadingGaugeCont.style.display = "none";
        if(response && response.response && response.response.data && response.response.data.message && response.response.data.message[0] && response.response.data.message[0].toLowerCase() === "please login to continue")
        {
            window.location.href = "/login";
        }
        return(config.ecbk(response.data));
    });
}
export function validateMandatoryIp(){
    let reqIpElem = document.getElementsByClassName('reqInput');
    let reqIpElemLen = reqIpElem.length
    let errIp =false;
    let errmsg = ["Please enter all mandatory Fields"]
    for(let loop = 0; loop < reqIpElemLen; loop++){
        if(reqIpElem[loop].value === "" || reqIpElem[loop].value === "Select..." || (reqIpElem[loop].classList && reqIpElem[loop].classList.contains('picky') && reqIpElem[loop].lastElementChild.lastElementChild.textContent.toLowerCase().indexOf('select..') >=0)){
            reqIpElem[loop].classList.add("errInput");
            errIp = true;
        }
    }
    if(errIp){
        ReactDOM.render(<HandleFormErrors value = {errmsg}/>,document.getElementById('formErrorCont'));
        return false;
    }
    else{
        return true;
    }
}
export function SwitchFunction(idValue , empid, filterObj, pageNumber , fromflag, fromflag1) {
    var filterData = filterObj ? filterObj : {};
    var page = pageNumber ? pageNumber : 1;
    let userId =  Cookies.get('userId');
    let projectId = window.projectId;
    let clientId = window.clientId;
    let startDate = window.startDate;
    let endDate = window.endDate;
    if(idValue)
        {
           switch(idValue) {
                case 'add_new_resource':
                    ReactDOM.render(<AddResource />,document.getElementById('switchTabsContainer'));
                    document.getElementById('hrmaincontainer').classList.add('newprofile');
                    break;
                case 'view_/_update_profile':
                    let viewProfileConfig ={}
                    let modifiedArray = "";
                    getprivelage('resource_edit') ? 
                    modifiedArray = [{"key":"Add New Resource","isActive":true}, {"key":"View / Update Profile","isActive":true}, {"key":"Exit","isActive":true}]
                    :
                    modifiedArray = [{"key":"View / Update Profile","isActive":true}];
                    ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "view_/_update_profile"/>,document.getElementById('tabTopcontainer'));
                    let successCbk = function(data) {
                        if(data && data.status && data.status.toLowerCase() === "success" && data.message && data.message.data) {
                            ReactDOM.render(<TableBody  headerData = {staticTxtObj.headerDataValue}  columns = {staticTxtObj.columnsValue} bodydata = {data.message.data} pagination = {data.message.pagination} filterObj = {filterData}/>,document.getElementById('switchTabsContainer'));
                            document.getElementById('hrmaincontainer').classList.remove('newprofile', 'editprofile', 'exitProfile');
                        }
                    }
                    let errorCbk = function(data) {
                        console.log(data);
                    }
                    viewProfileConfig.postData = {"limit": 10, "page": page, "filters": [filterData]};
                    viewProfileConfig.method = "post";
                    viewProfileConfig.apiUrl = "//localhost:4000/resources/getresources";
                    viewProfileConfig.scbk = successCbk;
                    viewProfileConfig.ecbk = errorCbk;
                    MakeAjax(viewProfileConfig);
                    break;
                case 'exit':
                    getprivelage('resource_edit') ? 
                    modifiedArray = [{"key":"Add New Resource","isActive":true}, {"key":"View / Update Profile","isActive":true}, {"key":"Exit","isActive":true}]
                    :
                    modifiedArray = [{"key":"View / Update Profile","isActive":true}];
                    ReactDOM.render(<Tab value = {modifiedArray  ? modifiedArray : []} trigger = {false} defaultSelect = "exit"/>,document.getElementById('tabTopcontainer'));
                    ReactDOM.render(<Exit/> ,document.getElementById('switchTabsContainer'));
                    document.getElementById('hrmaincontainer').classList.add('exitProfile');
                    break;
                case 'basic_details':
                    if(projectId && clientId){
                        let newProjConfig = {};
                        newProjConfig.apiUrl = "http://localhost:4000/project/get";
                        newProjConfig.method = "post";
                        newProjConfig.postData = {"project_id":projectId,"client_id":clientId};
                        newProjConfig.scbk = function(data)
                        {
                            if(data.status === "Success")
                            {
                                let staticDataCopy = JSON.parse(JSON.stringify(staticTxtObj && staticTxtObj.createProjBasic ? staticTxtObj.createProjBasic : []));
                                let staticDataCopyData = staticDataCopy && staticDataCopy[0] && staticDataCopy[0].data && staticDataCopy[0].data ? staticDataCopy[0].data : []
                                let staticDataCopyLen = staticDataCopyData.length ? staticDataCopyData.length : 0;
                                let responseData = data.data && data.data[0] ? data.data[0] : [];
                                for(let loop = 0; loop < staticDataCopyLen; loop++){
                                    staticDataCopy[0].data[loop].value = responseData[staticDataCopyData[loop].id];
                                    if(staticDataCopy[0].data[loop].id === "project_id")
                                    {
                                        staticDataCopy[0].data[loop].isDisabled = true;
                                    }
                                   
                                }
                                ReactDOM.render(<ProjectsPage noTriggerVal = {true} defaultSelectTab = {"basic_details"}/>,document.getElementById('mainContainer'));
                                ReactDOM.render(<AddProject value = {staticDataCopy}/>,document.getElementById('switchTabsContainer'));
                            }
                            else
                            {
                                console.log("error");
                                if(data && data.message){
                                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                                }
                            }
                        };
                        newProjConfig.ecbk = function(data)
                        {
                            console.log("error")
                            if(data && data.message){
                                ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('formErrorCont'));
                            }
                        };
                        MakeAjax(newProjConfig);
                    }
                    else{
                        let projectstaticDataCopy = JSON.parse(JSON.stringify(staticTxtObj && staticTxtObj.createProjBasic ? staticTxtObj.createProjBasic : []));
                        if(projectstaticDataCopy && projectstaticDataCopy[0] && projectstaticDataCopy[0].data && projectstaticDataCopy[0].data[0] && projectstaticDataCopy[0].data[0].id && projectstaticDataCopy[0].data[0].id === "client_name"){
                            projectstaticDataCopy[0].data[0].value = window.client_name ? window.client_name  : "";
                        }
                        ReactDOM.render(<AddProject id = {window.subproject ? "addSubproject" : ""} value = {projectstaticDataCopy}/>,document.getElementById('switchTabsContainer'));
                    }
                    break;
                case 'assign_/_request_resource':
                    if(projectId && fromflag === "projectResource"){
                        let proResConfig = {};
                        let scbk = function(data) {
                            if(data && data.status && data.status.toLowerCase() === "success") {
                                let successData = data.data && data.data.projectResources && data.data.projectResources.length ? data.data.projectResources : [];
                                let pagination = data.data && data.data.pagination ? data.data.pagination : "";
                                let successDataLen = successData.length;
                                successData.projectId = projectId;
                                successData.clientId = clientId;
                                for(let loop = 0; loop < successDataLen; loop++){
                                    let projects = successData[loop].projects ? successData[loop].projects : [];
                                    let projectsLen = projects.length;
                                    for(let innerLoop = 0; innerLoop < projectsLen; innerLoop++){
                                        successData[loop].resourceRole = projects[innerLoop].role ? projects[innerLoop].role : "";
                                        successData[loop].resourceStartDate = projects[innerLoop].start_date ? projects[innerLoop].start_date : "";
                                        successData[loop].resourceEndDate = projects[innerLoop].end_date ? projects[innerLoop].end_date : "";
                                        successData[loop].resourceAllocatedPercent = projects[innerLoop].allocation ? projects[innerLoop].allocation + "%" : "";
                                        let availablePercentageStrig = String(successData[loop].availablePercentage);
                                        availablePercentageStrig += availablePercentageStrig.indexOf("%") === -1 ? "%" : "";
                                        successData[loop].availablePercentage = availablePercentageStrig ? availablePercentageStrig : "0%"
                                    }
                                }
                                localStorage.setItem("projectResourceData",JSON.stringify(successData));
                                ReactDOM.render(<AddProjectResource />,document.getElementById('switchTabsContainer'));
                                ReactDOM.render(<div><div className = "tableHeading">Project Allocated Resource : </div><TableBody  headerData = {staticTxtObj.projectresourceHeaderData}  columns = {staticTxtObj.projectresourceColumnsValue} bodydata = {successData} pagination = {pagination} isFrom = "projectResource" id="projectResource"/></div>,document.getElementById('ProjectResource'));
                            }
                            else if(data.status && data.status.toLowerCase() === "failure" && data && data.message && data.message.length){
                                if(data.message[0] === "No records found"){
                                    var list = document.getElementById('ProjectResource');
                                    if(list && list.childNodes && list.childNodes.length){
                                        list.removeChild(list.childNodes[0]);
                                    }
                                }
                                else{
                                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                                }
                            }
                        }
                        let ecbk = function(data) {
                            console.log(data);
                        }
                        proResConfig.postData = {"project_id":projectId, "limit": 3, "page": page,"client_id" : clientId};
                        proResConfig.method = "post";
                        proResConfig.apiUrl = "//localhost:4000/resources/get-project-resources";
                        proResConfig.scbk = scbk;
                        proResConfig.ecbk = ecbk;
                        MakeAjax(proResConfig);
                    }
                    if(startDate && endDate && fromflag1 && fromflag1 === "availableResource"){
                        filterData.start_date = filterData.start_date ? filterData.start_date : startDate;
                        filterData.end_date = filterData.end_date ? filterData.end_date : endDate;
                        let freeResConfig = {};
                        let scbk = function(data) {
                            if(data && data.status && data.status.toLowerCase() === "success" && data.data) {
                                let successData = data.data && data.data.availableResources && data.data.availableResources.length ? data.data.availableResources: [];
                                successData.projectId = projectId;
                                successData.clientId = clientId;
                                successData.projectStart_date = startDate;
                                successData.projectEnd_date = endDate;
                                ReactDOM.render(<AddProjectResource data = {{ calendarStart : startDate , calendarEnd : endDate}}/>,document.getElementById('switchTabsContainer'));
                                ReactDOM.render(<div><div className = "tableHeading">Resources available during given time span : </div><TableBody  headerData = {staticTxtObj.projectAvailableresourceHeaderData}  columns = {staticTxtObj.projectAvailableresourceColumnsValue} bodydata = {successData} pagination = {data.data.pagination} isFrom = "availableResource" id="availableResource"/></div>,document.getElementById('ProjectAvailableResource'));
                            }
                        }
                        let ecbk = function(data) {
                            console.log(data);
                        }
                        freeResConfig.postData = {"filters":filterData, "limit": 10, "page": page, "project_id": projectId, "client_id" : clientId};
                        freeResConfig.method = "post";
                        freeResConfig.apiUrl = "//localhost:4000/resources/get-available-resources";
                        freeResConfig.scbk = scbk;
                        freeResConfig.ecbk = ecbk;
                        MakeAjax(freeResConfig);
                    }
                    if(!projectId && !startDate && !endDate){
                        ReactDOM.render(<InvalidProject value = {"Please Enter Project Details"}/>,document.getElementById('switchTabsContainer'));
                    }
                    break;
                case 'resource_cost':
                    if(projectId){
                        let resourceCostConfig = {};
                        resourceCostConfig.scbk = function(data) {
                            if(data && data.status && data.status.toLowerCase() === "success") {
                                let manipulatedData = getResourceCount(data)
                                let prefilledData = data.prefilled_data ? data.prefilled_data : [];
                                let prefilledDataLen = prefilledData.length;
                                let manipulatedDataLen = manipulatedData.length;
                                for(let midx = 0; midx < manipulatedDataLen ; midx++)
                                {
                                    for(let idx=0 ; idx < prefilledDataLen ; idx++)
                                    {
                                        if(manipulatedData[midx].role.toLowerCase() === prefilledData[idx].role.toLowerCase())
                                        {
                                            manipulatedData[midx].cost_per_resource = prefilledData[idx].cost_per_resource;
                                            manipulatedData[midx].resource_cost = prefilledData[idx].resource_cost;
                                            manipulatedData[midx].count = prefilledData[idx].count;
                                        }
                                    }
                                }
                                ReactDOM.render(<AddProjectResourceCost response = {manipulatedData}/>,document.getElementById('switchTabsContainer'));
                            }
                            else if(data && data.status === "Failure")
                            {
                                if(!data.prefilled_data){
                                    ReactDOM.render(<InvalidProject value = {"Please Add Resource for project."}/>,document.getElementById('switchTabsContainer'));
                                }
                                else{
                                    ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('errorDom'));
                                }
                            }
                        }
                        resourceCostConfig.ecbk = function(data) {
                            console.log(data);
                        }
                        resourceCostConfig.postData = {"project_id":projectId , "client_id" : clientId};
                        resourceCostConfig.method = "post";
                        resourceCostConfig.apiUrl = "http://localhost:4000/resources/getresourcecount";
                        MakeAjax(resourceCostConfig);
                    }
                    else{
                        ReactDOM.render(<InvalidProject value = {"Please Enter Project Details"}/>,document.getElementById('switchTabsContainer'));
                    }
                    break;
                case 'view_profile' :
                case 'edit_profileByViewing':
                    let editProfileConfig = {}
                    editProfileConfig.apiUrl = "http://localhost:4000/resources/viewresource-details";
                    editProfileConfig.method = "post";
                    editProfileConfig.postData = {"employee_id":empid};
                    editProfileConfig.scbk = function(data)
                    {
                        let popupValue = "";
                        if(data && data.status === "Success")
                        {
                            popupValue = "Viewing Profile"
                        }
                        else
                        {
                            popupValue = "Error"
                            data = {objectArr:[{"Value":"There was an error while attempting to fetch the details"}]}
                        }
                      if(idValue === "view_profile" && data && data.status === "Success")
                      {
                        document.getElementById("popupContainer").classList.add("view_profile");
                        data.data["in_Notice_Period"] ? data.data["in_Notice_Period"] = "Yes" : data.data["in_Notice_Period"] = "No";
                        data.data["passport"] ? data.data["passport"] = "Available" : data.data["passport"] = "Not Available";
                        ReactDOM.render(<RenderPopup value = {data} popupName = {popupValue} />,document.getElementById('popupContainer'));
                        document.getElementById("popupContainer").style.height = ((document.getElementsByClassName('popupInnerCont')[0].offsetHeight) - 150) + "px";
                      }
                      if(idValue === "edit_profileByViewing" && data && data.status === "Success")
                      {
                        let objectArr = data && data.data ? data.data : [];
                        ReactDOM.render(<EditResource prefilledData = {objectArr} />,document.getElementById('switchTabsContainer'));
                        document.getElementById('hrmaincontainer').classList.add('editprofile');
                      }
                    };
                    editProfileConfig.ecbk = function(data)
                    {
                        if(data && data.message){
                            ReactDOM.render(<HandleFormErrors value = {data.message}/>,document.getElementById('popupErrors'));
                        }
                    };
                    MakeAjax(editProfileConfig);
                    break;
                case 'my_resource' :
                    let checkResAvailConfig = {};    
                    checkResAvailConfig.scbk = function(data) {
                        if(data && data.status && data.status.toLowerCase() === "success" && data.message) {
                            document.getElementById('hrmaincontainer').classList.remove('resourceRequestedCont');
                            ReactDOM.render(<ResourceTableBody  bodydata = {data.data.functionalResources ? data.data.functionalResources : [] }  headerData = {staticTxtObj && staticTxtObj.ResourceHeaderDataValue ? staticTxtObj.ResourceHeaderDataValue : ""}  columns = {staticTxtObj && staticTxtObj.ResourceHeaderDataColumnValue ? staticTxtObj.ResourceHeaderDataColumnValue : ""}/>,document.getElementById('switchTabsContainer'));
                        }
                    }
                    checkResAvailConfig.ecbk = function(data) {
                        console.log(data);
                    }
                    checkResAvailConfig.postData = {"employee_id": userId,"filters": [{}]};
                    checkResAvailConfig.method = "post";
                    checkResAvailConfig.apiUrl = "http://localhost:4000/resources/check-resource-availability";
                    MakeAjax(checkResAvailConfig);
                    break;
                case 'resource_requested' :
                    let pendingStatusConfig = {};
                    pendingStatusConfig.scbk = function(data) {
                        if(data && data.status && data.status.toLowerCase() === "success") {
                            document.getElementById('hrmaincontainer').classList.add('resourceRequestedCont');
                            ReactDOM.render(<ResourceRequestTableBody  bodydata = {data.data}  headerData = {staticTxtObj && staticTxtObj.ResourceRequestHeaderData ? staticTxtObj.ResourceRequestHeaderData : ""}  columns = {staticTxtObj && staticTxtObj.ResourceRequestColumnValue ? staticTxtObj.ResourceRequestColumnValue : ""}/>,document.getElementById('switchTabsContainer'));
                        }
                        else if(data && data.status && data.status.toLowerCase() === "failure"){
                            document.getElementById('hrmaincontainer').classList.add('resourceRequestedCont');
                            ReactDOM.render(<ResourceRequestTableBody  bodydata = {data.data ? data.data : []}  headerData = {staticTxtObj && staticTxtObj.ResourceRequestHeaderData ? staticTxtObj.ResourceRequestHeaderData : ""}  columns = {staticTxtObj && staticTxtObj.ResourceRequestColumnValue ? staticTxtObj.ResourceRequestColumnValue : ""}/>,document.getElementById('switchTabsContainer'));
                        }
                    }
                    pendingStatusConfig.ecbk = function(data) {
                        console.log(data);
                    }
                    pendingStatusConfig.postData = {"employee_id":userId};
                    pendingStatusConfig.method = "post";
                    pendingStatusConfig.apiUrl = "http://localhost:4000/resources/getpendingstatus";
                    MakeAjax(pendingStatusConfig);
                    break;
                default:
                   return "";
            }
        }
}

export function getResourceCount(data)
{
    let tempArr = [];
    let tempObj = {};
    let mainArr = [];
    let responseData = data.data ? data.data : "";
    for(let k=0 ; k< responseData.length ; k++)
    {
        if(responseData[k] && responseData[k].role)
        {
            tempArr.push(responseData[k].role.toUpperCase());
        }
    }
    tempArr.sort();
    var current = null;
    var cnt = 0;
    for (var i = 0; i < tempArr.length; i++) {
        if (tempArr[i] !== current) {
            if (cnt > 0) {
                tempObj.role = current 
                tempObj.count = String(cnt);
                mainArr.push(tempObj);
                tempObj = {};
            }
            current = tempArr[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        tempObj.role = current 
        tempObj.count = String(cnt);
        mainArr.push(tempObj);
        tempObj = {};
    }
    return mainArr;
}
export function getprivelage(checkprivelage)
{
    let data = getCookie("pancakeData");
    if(data){
        data = JSON.parse(data);
    }
    if(data && data.privelage && data.privelage.length)
    {
        
        let privelageData = data.privelage;
        let dataLen = privelageData ? privelageData.length : "";
        for(let idx=0 ; idx<dataLen ; idx++)
        {
            if(privelageData[idx] && privelageData[idx].toLowerCase() === checkprivelage.toLowerCase())
            {
                return true;
            }
        }
        return 0;
    }
}
export function getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
export function checkEmptyFields(fieldValues)
{
    if(fieldValues)
    {
        let objectArr = fieldValues;
        let ObjectKeys = Object.keys(objectArr)
        let objectArrLen = ObjectKeys.length;
        for(let i=0  ;i < objectArrLen ; i++)
        {
            if(!objectArr[ObjectKeys[i]])
            {
                delete objectArr[ObjectKeys[i]];
            }
        }
        return objectArr;
    }
    return false;
}
export function renderSuccessPopUp(message){
    ReactDOM.render(<RenderPopup popupName = {"Success"} successValue = {message}/>,document.getElementById('popupContainer'));
    document.getElementById("popupContainer").style.height = document.getElementsByClassName('popupInnerCont')[0].offsetHeight +"px";
}