import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import authSvc from "../../Services/auth-service";

const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    const isLoggedIn = await authSvc.login(email, password);
    if (isLoggedIn) {
      props.onLogin();
      navigate("/Dashboard");
    }
  };

  return (
    <div className="container-fluid login">
      <div className="container-fluid login-clr">
        <div className="container login-main">
          <h2 className="text-center head-login">POS</h2>
          <br />
          <p className="text-center fw-bold">Sign in to continue access</p>
          <br />
          <form className="row login-form" onSubmit={(e) => login(e)}>
            <div className="col-12 mb-3">
              <div className="input-group mb-3 input-login">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-envelope" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="input-group mb-3 input-login">
                <span className="input-group-text">
                  <i className="bi bi-key" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-100 forgot-btn"
                type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
