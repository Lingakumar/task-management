import React, { Component } from 'react';
import logo from '../images/logo.png';
import '../css/Header.css';
import ReactDOM from 'react-dom';
import Login from './Login';
import '../css/popup.css'
import { BrowserRouter as Router, Route , Redirect, Switch} from 'react-router-dom';
import HrLanding from './Hr';
import {DmLanding} from './Dm';
import Cookies from 'js-cookie';
import {MakeAjax} from './utils/util'
import Resource from "./Resource"
class Header extends Component {
    constructor(props)
    {
        super(props);
        this.state = {userName : Cookies.get('userName'), showloadingGauge : false , userId : Cookies.get('userId'),pancakeData :  Cookies.get('pancakeData') ? JSON.parse(Cookies.get('pancakeData')) : ""};
        this.handleLogo = this.handleLogo.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.maskClickAction = this.maskClickAction.bind(this);
        this.handleLoginRedirection = this.handleLoginRedirection.bind(this);
    }
    handleLogo()
    {
        /*if(window.location.pathname != "/login")
        {
            window.location.href = "/login";
        }*/
    }
    handleLogout(event)
    {
        event.preventDefault();
        Cookies.remove('pancakeData');
        var config = {};
        config.scbk = function(response) {
          if(response.status === "Success")
            { 
                window.location.href = "/login";
            }    
        }     
        config.ecbk = function(data) {
            console.log(data);
        }
        config.method = "get";
        config.apiUrl = "http://localhost:4000/user/logout";
        MakeAjax(config);  
    }
    handleLoginRedirection(event){
        if(window.location.pathname !== "/login"){
            window.location.href = "/login";
        }
    }
    maskClickAction(e) {
        let maskClassList = e.target.classList;
        if(maskClassList.contains("backroundMask")){
            document.getElementById("popupContainer").classList.remove("view_profile");
            maskClassList.add("hideContainer");
        }
    }
    render() 
    {
        return (
            <Router>
                <div className = "parentDom">
                    <div className="header">
                        <div className="header_container">
                            <div className="leftcontent">
                                <div className="h-icon"><img className="h-image-icon" alt = "Logo" src={logo} onClick={this.handleLogo}></img></div>
                                <div className="logocontent">Skava Process Management</div>
                            </div>
                            <div className="rightContent">
                                <div className = "welcomeUser">
                                        { 
                                            this.state.userName ? <div className="welcome">Welcome <span>{this.state.userName.replace("|" , " ")}</span></div> :""
                                        }
                                </div>
                                <div className="userParent">
                                    { 
                                        this.state.userId && this.state.userId !== "0"? <div className="logout" onClick={this.handleLogout}>Logout</div> : <div className="login" onClick={this.handleLoginRedirection}>LogIn</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "parentContainer">
                        <Route path="/login" component={Login}/>
                    </div>
                    {this.state.pancakeData && (window.location.pathname === "/dmlanding" || window.location.pathname === "/hrlanding") ?
                        <div id = "NavigationCont">
                            <Navigation value = {this.state.pancakeData.redirectData ? this.state.pancakeData.redirectData : []}/>
                        </div> : this.handleLoginRedirection()
                    }
                    <div id = "mainContainer" className="maincontent project_viewer">
                        <Switch>
                            <Route exact path="/" render={() => (
                                <Redirect to="/login"/>
                            )}/>
                            <Route exact path="/hrlanding" component = {HrLanding}/>
                            <Route exact path="/dmlanding" component = {DmLanding}/>
                            <Route exact path="/account" component = {Maintenance}/>
                            { 
                                window.location.pathname !== "/login" && window.location.pathname !== "/" ? <Route component = {InvalidPage}/> : ""
                            }
                        </Switch>
                    </div>
                    <div id = "popupOuterContainer">
                        <div className = "backroundMask hideContainer" onClick = {this.maskClickAction}>
                            <div className = "popupSection" id = "popupContainer"></div>
                        </div>
                    </div>
                    <div id = "loadingGaugeContainer" >
                        <div className = "loadingGauge"></div>
                    </div>
                    <div className = "footer">
                        <div className="footerContent"></div>
                    </div>
                </div>
            </Router>
        );
    }
}
class InvalidPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div className="invalidPage">The page you requested can't be found—sorry about that! <br/> Please check the URL and try again</div>
        )
    }
}
export class Maintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div className="maintenancePage">Temporarily Down for Maintenance<br/> We will be back soon</div>
        )
    }
}
export class Navigation extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {resourcesvalue: this.props.value , showPancake : false , selected : ""};
        this.handleNavigation = this.handleNavigation.bind(this);
        this.pancakeArrowAction = this.pancakeArrowAction.bind(this);
        this.addSelectedClass = this.addSelectedClass.bind(this);
    }
    pancakeArrowAction()
    {
        var pancakeelem = document.getElementById('hrpancakeContainer');
        if(pancakeelem.classList.contains('pancakeshrinked'))
        {
           this.setState({hidePancake : false});
        }
        else
        {
            this.setState({hidePancake : true});
        }
    }
    handleNavigation(thisValue)
    {   
        if(thisValue === "resource_management"){
            ReactDOM.render(<Resource triggerNavigation = {"true"} />,document.getElementById('mainContainer'));
        }
        else if(thisValue === "project_management"){
            ReactDOM.render(<DmLanding triggerNavigation = {"true"} makeCall = {true}/>,document.getElementById('mainContainer'));
        }
        else if(thisValue === "employee_profile")
        {
            ReactDOM.render(<HrLanding triggerNavigation = {"true"}/>,document.getElementById('mainContainer'));
        }
        else if(thisValue === "account_management")
        {
            ReactDOM.render(<Maintenance/>,document.getElementById('mainContainer'));
        }
        this.setState({selected  : thisValue});
    }
    componentDidMount()
    {
        let thisObj = this;
        if(this.state.resourcesvalue && this.state.resourcesvalue)
        {
            this.state.resourcesvalue.map(function(data){
                if(data.selected)
                {
                    let name = data.name.toLowerCase().replace(" ","_");
                    thisObj.setState({selected  : name})
                    if(name === "resource_management"){
                        ReactDOM.render(<Resource/>,document.getElementById('mainContainer'));
                    }
                    else if(name === "project_management"){
                        ReactDOM.render(<DmLanding makeCall = {true}/>,document.getElementById('mainContainer'));
                    }
                    else if(name === "employee_profile")
                    {
                        ReactDOM.render(<HrLanding triggerNavigation = {false}/>,document.getElementById('mainContainer'));
                    }
                }
            })
        }
    }
    componentDidUpdate(){
        let mainContainerElem = document.getElementById('NavigationCont');
        if(mainContainerElem && this.state.hidePancake)
        {
            mainContainerElem.classList.add("shrinkedPancake");
        }
        else{
            mainContainerElem.classList.remove("shrinkedPancake");
        }
    }
    addSelectedClass(value)
    {
        return ((value === this.state.selected) ? 'subcategories active selectedCategory':' subcategories active');
    }
    render() 
    {
        var thisObj = this;
            return (
            <div className = {this.state.hidePancake ? "hrnavigationPanel pancakeshrinked" : "hrnavigationPanel"} id = "hrpancakeContainer"> 
                <div className = "arrowContainer" id = "hrpancake" onClick = {thisObj.pancakeArrowAction}></div>
                <div className = "navMainContainer">
                    {this.state.resourcesvalue.map(function(hrcategory, index){
                        return(
                            <div className={thisObj.addSelectedClass(hrcategory.name.replace(" ","_").toLowerCase())} key={index} ref= "category">
                                <span className = "subcategory_title" id = {hrcategory.name.replace(" ","_").toLowerCase()} onClick = {thisObj.handleNavigation.bind(this , hrcategory.name.replace(" ","_").toLowerCase())}>{hrcategory.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
export default Header;