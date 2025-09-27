import React from "react";
import { Link } from "react-router-dom";

function register() {

    return(
        
        <div>

<div className="container px-4 py-5 mx-auto">
   <div className="card card0">
     <div className="d-flex flex-lg-row flex-column-reverse">
       <div className="card card1">
        <div className="row justify-content-center my-auto">
          <div className="col-md-8 col-10 my-4">
            <div className="row justify-content-center px-3 mb-3">
              <img id="logo" src="/assets/images/logo.png" />
            </div>
            <h3 className="mb-5 text-center heading">CREATE YOUR ACCOUNT</h3>
            {/* <h6 className="msg-info">Please login to your account</h6> */}
            <div className="form-group">
              <label className="form-control-label text-muted">Full Name</label>
              <input
                type="text"
                id="email"
                name="Name"
                placeholder="Phone no or email id"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label text-muted">Email Address</label>
              <input
                type="password"
                id="psw"
                name="psw"
                placeholder="Email"
                className="form-control"
              />
            </div> 
             <div className="form-group">
              <label className="form-control-label text-muted">Password</label>
              <input
                type="password"
                id="psw"
                name="psw"
                placeholder="Password"
                className="form-control"
              />
            </div>
            <div className="row justify-content-center my-3 px-3">
              <button className="btn-block btn-color">Register</button>
            </div>
            <div className="row justify-content-center my-2">
              {/* <a href="#">
                <small className="text-muted" style={{fontSize:"15px",fontWeight:"bold"}}>Forgot Password?</small>
              </a> */}
            </div>
          </div>
        </div>
        <div className="bottom text-center mb-3">
          <p className="sm-text mx-auto mb-3">
           Already have an account?
           <Link to="/login">
            <button className="btn btn-white ml-2">Sign In</button>
            </Link>
          </p>
        </div>
      </div>
      <div className="card card2">
        <div className="my-auto mx-md-5 px-md-5 right">
          <h1 className="text-white" style={{fontSize:"40px"}}>Brewing Connections, Building Community</h1>
          <small className="text-black" style={{fontSize:"20px",fontWeight:"bold"}}> 
            At NovaScotiaAle, we believe in more than just business — we believe in people, stories, and experiences that bring us together.
          </small>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
    )
    
}
export default register;