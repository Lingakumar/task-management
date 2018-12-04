import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import axios from 'axios';
import '../css/Dashboard.css'
import Project from './Project.js'
import Resource from './Resource';
class Dashboard extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {dashboardContent: [ {value : "Project",isActive : true}, {value : "Resource",isActive : true}, {value : "Settings",isActive : false}, {value : "Privilege",isActive : false}]};
    }
    render() {
      return (
            <div>
                 <div className="dashboard_Page">
                <section className="dashboard_explorer">
                    <div className="dashboard_projects">
                    {this.state.dashboardContent.map(function(content){
                        return <Card data = {content}/>
                    })}
                    </div>
                </section>
                </div>
            </div>
            );
      }
}
class Card extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {content: this.props.data};
        this.navigatePage = this.navigatePage.bind(this);
    }
    navigatePage(event)
    {
        var cardContainer = this.refs.cardContent;
        var attrValue = cardContainer.getAttribute('value');
        if(attrValue === "Project" || attrValue === "Resource")
        window.location.href = attrValue;
    }
    render()
    {
        return(
            <div className = "cardParent">
                <div className = {this.state.content.isActive ? "cardContainer active" : "cardContainer" }>
                    <section className = "cardContent" ref= "cardContent" value = {this.state.content.value} onClick = {this.navigatePage.bind(this)}>
                        <div className = "cardLogoContainer"><span>{this.state.content.value.slice(0,1)}</span></div>
                        <div className = "cardText">{this.state.content.value}</div>
                    </section>
                </div>
            </div>
           );
      }
}
export default Dashboard;