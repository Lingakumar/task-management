import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../css/Login.css'
import {MakeAjax} from './utils/util'
class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {emailInput:"",pwdInput:"",errorValue:"",showErrorDom :{display:"none"}};
        this.handleEmailchange = this.handleEmailchange.bind(this);
        this.handlepwdchange = this.handlepwdchange.bind(this);
        this.signinFunction = this.signinFunction.bind(this);
    }
    render() {
      return (
        <div>
          <form onSubmit = {this.signinFunction}>
           <div className="loginpage" id="loginpage">
           <div id="errordom" style={this.state.showErrorDom}>
              {
                  this.state.errorValue ? this.state.errorValue.map(function(error , key)
                  {
                    return <span>{key+1} {error.replace(/[_]/g, ' ')}<br/></span>
                  })
                  :""
              }
            </div>
                <section id = "loginContainer" className = "loginWrapper">
                    <h4 className="loginHeader">Login</h4>
                    <section className = "userName">
                        <div className="logintextBox">
                             <div id="userid" placeholder="Username">
                                 <div className="mailImg"></div>
                                 <input value={this.state.emailInput} onChange={this.handleEmailchange} placeholder = "Mail" className="uinput input" type = "email" maxLength = "60"></input>
                            </div>
                        </div>
                    </section>     
                    <section className = "password">
                        <div className="passwordtextBox">
                            <div id="pwdid" placeholder="Password">
                                <div className="passwordImg"></div>
                                <input value={this.state.pwdInput} onChange={this.handlepwdchange} placeholder = "Password" className="uinput input" type = "password" maxLength = "60" ></input>
                            </div>
                        </div>
                    </section>
                    <Button function = {this.signinFunction} buttonText ="LOGIN" />  
                    <section className = "helpcontainer">
                        <div className = "forgotpwdcontent" onClick = {this.handleForgotPwd} >Forgot Your Password ?</div>
                    </section>
                </section>
           </div>
           </form>
        </div>
        );
    }
    handleEmailchange(e)
    {
      this.setState({emailInput:e.target.value})
    }
    handlepwdchange(e)
    {
      this.setState({pwdInput:e.target.value})
    }
    signinFunction(event)
    {
        event.preventDefault();
        var enteredEmailValue = this.state.emailInput;
        var enteredPwdValue = this.state.pwdInput;
        var self = this;
        var config = {};
        config.scbk = function(response) {
          var responseData = response && response.data ? response.data : response;
          if(responseData)
          {
            if(responseData.status === "Failure" && responseData.message && responseData.message[0])
            {
              self.setState({errorValue:responseData.message});
              self.setState({showErrorDom:{display:'block'}});
            }
            else if(response.status === "Success")
            {
              if(responseData.redirectUrl && responseData.redirectUrl)
              {
                document.cookie = "pancakeData="+JSON.stringify(responseData);
                window.location.href = responseData.redirectUrl;
              }
            }
          }     
        }
        config.ecbk = function(data) {
            console.log(data);
        }
        config.postData = {"email_id":enteredEmailValue,"password":enteredPwdValue}
        config.method = "post";
        config.apiUrl = "http://localhost:4000/user/login";
        MakeAjax(config);  
    }
    handleForgotPwd()
    {
        document.getElementById('loginpage').classList.add('forgotPwdContainer');
        ReactDOM.render(<ForgotPwd/>,document.getElementById('loginContainer'));
    }
   
}
class ForgotPwd extends Component
{
  constructor(props)
  {
      super(props);
      this.state = {emailValue : "",showErrorDom :{display:"none"} , errorValue : ""};
      this.forgotPwdfunction = this.forgotPwdfunction.bind(this);
      this.handlemail = this.handlemail.bind(this);
  }
  handlemail(e)
  {
    this.setState({emailValue : e.target.value});
  }
  render()
  {
    return(
      <div>
          <div className="forgeotPwdForm">
            <div className="forgotPwd_model">
              <div className="modal_header">
                <h4 className="loginHeader">Forgot Password Form</h4>
              </div>
              <div id="errordom" style={this.state.showErrorDom}>
              {
                  this.state.errorValue ? this.state.errorValue.map(function(error , key)
                  {
                    return error
                  })
                  :""
              }
              </div>
              <div className="modal_container">
                <form id="forgotpwd_form">
                  <div className="pwdResetformContainer"> 
                    <div className="emailid inputDiv forgotPwdParentdiv">
                      <div className="mailImg"></div>
                        <input type="email" name="email" placeholder="Email" value={this.state.emailValue} onChange={this.handlemail} maxLength="60" className="input" />
                      </div>
                  </div>
                  <Button function = {this.forgotPwdfunction} buttonText ="Forgot Password"/>
                  <BacktoLogin function = {this.backToLogin}/>
                </form>
              </div>
            </div>
          </div>
       </div>
    );
  }
  forgotPwdfunction(event)
  {
    event.preventDefault();
    var emailValue = this.state.emailValue;
    var _self = this;
    axios({
      method: 'post',
      url: 'http://localhost:4000/api/rest/forgotPassword',
      data: {"mailId":emailValue},
      config: { headers: {'Content-Type': 'application/json' }},
      credentials: 'same-origin'
      })
      .then(function (response) {
          var responseData = response && response.data ? response.data : "";
          if(responseData.status && responseData.status === "success")
          {
              window.location.href = "/";
          }
          else if(responseData && responseData[0] && responseData[0].msg)
          {
            _self.setState({errorValue:responseData[0].message});
            _self.setState({showErrorDom:{display:'block'}});
          }
          else
          {
            if(responseData && responseData.message)
            _self.setState({errorValue: responseData.message});
            _self.setState({showErrorDom:{display:'block'}});
          }
      })
      .catch(function (response) {
          //handle error
          console.log(response);
      });
  }
}  
class Button extends Component
{
  constructor(props) {
    super(props);
    this.function  = this.props.function;
    this.state = {"buttonText" : this.props.buttonText};
  }
  render() {
       return(
        <div className = "button">
         <button className = "realButton" type = "submit"></button>
          <div className="type-3">
              <a href="" className="btn btn-3" onClick={this.function}>
                <span className="txt">{this.state.buttonText}</span>
                <span className="round"><i className="fa fa-chevron-right"></i></span>
              </a>
          </div>
        </div>
     )
  }
}
class BacktoLogin extends Component
{
  constructor(props) {
    super(props);
    this.backToLogin  = this.backToLogin.bind(this);
 }
  render() {
       return(
        <div className="backtoLogincont">
             <div className="btoLogin" onClick={this.backToLogin} > Back to Login </div>
        </div>
     )
  }
  backToLogin()
  {
     ReactDOM.render(<Login/>,document.getElementById('loginContainer'));
  }
}
export default Login;
