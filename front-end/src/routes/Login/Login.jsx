import React, { useState, useContext } from "react";
import "./Login.scss";
import google from "./search.png";
import { AuthContext } from "../../Context/Authcontext";
import axios from "axios";

function Login() {
  const [state, setstate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const SERVER_URL = "https://sticky-keeps.herokuapp.com/api";

  // const SERVER_URL = "http://localhost:8080/api";

  const fetchAuthUser = async () => {
    const response = await axios
      .get(SERVER_URL + "/auth/user", { withCredentials: true })
      .catch((err) => console.log("Authentication Not done"));

    if (response && response.data) {
      console.log("User:", response.data);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    }
  };

  const handleClickLogin = async (e) => {
    e.preventDefault();
    const userCredential = {
      username: name,
      password: password,
    };
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(SERVER_URL + "/auth/login", userCredential);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
  };
  const handleClickSignup = async (e) => {
    e.preventDefault();
    const userCredential = {
      username: name,
      email: email,
      password: password,
    };
    try {
      const res = await axios.post(
        SERVER_URL + "/auth/register",
        userCredential
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };
  const defaultLogin = async (e) => {
    e.preventDefault();

    const LoginUrl = `${SERVER_URL}/auth/${e.target.alt}`;
    const newWindow = window.open(LoginUrl, "_blank", "width=500, height=600");
    if (newWindow) {
      let timer = setInterval(() => {
        if (newWindow.closed) {
          fetchAuthUser();
          clearInterval(timer);
        }
      }, 500);
    }
  };

  return (
    <div className="Login">
      <div
        className={`container ${state ? "right-panel-active" : ""}`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form onSubmit={handleClickSignup}>
            <h1>Create Account</h1>
            <div className="social-container">
              <img
                src={google}
                alt="google"
                className="social"
                onClick={defaultLogin}
              />
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Username"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleClickLogin}>
            <h1>Sign in</h1>
            <div className="social-container">
              <img
                src={google}
                alt="google"
                className="social"
                onClick={defaultLogin}
              />
            </div>
            <span>or use your account</span>
            <input
              type="text"
              placeholder="Username"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => {
                  setstate((prev) => {
                    return !prev;
                  });
                }}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => {
                  setstate((prev) => {
                    return !prev;
                  });
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
