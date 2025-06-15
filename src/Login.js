import React, { useRef, useState } from "react";
import "./Login.css";
import { json, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import LoaderNew from "./LoaderNew";

function Login() {
  const [Fetching, setFetching] = useState(false);
  const [FetchingForReg, setFetchingForReg] = useState(false);

  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: email.current.value,
      password: password.current.value,
    };
    console.log(user);

    const login = async () => {
      setFetching(true);
      const resp = await fetch(
        "https://flowing-capsule-462810-j2.df.r.appspot.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      console.log(resp);
      if (resp.status === 401) {
        toast.error("Wrong Credentials! ");
        return;
      }
      if (!resp.ok) {
        toast.error("something Went Wrong! ");
        return;
      }

      const jsonResp = await resp.json();

      localStorage.setItem("token", jsonResp.token);
      localStorage.setItem("role", jsonResp.role);

      console.log(jsonResp);
      navigate("/");
      setFetching(false);
    };

    try {
      await login();
      setFetching(false);
    } catch (error) {
      console.log(error);
      toast.error("something Went Wrong! ");
      setFetching(false);
      return;
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const user = {
      username: email.current.value,
      password: password.current.value,
    };

    const Register = async () => {
      setFetchingForReg(true);
      const resp = await fetch(
        "https://flowing-capsule-462810-j2.df.r.appspot.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      setFetchingForReg(false);
      console.log(resp);
      if (!resp.ok) {
        toast.error("something Went Wrong! ");
        return;
      }

      if (resp.status === 200) {
        toast.error("registered! ");
      }

      const jsonResp = await resp.json();
      console.log(jsonResp);
    };

    try {
      await Register();
      setFetchingForReg(false);
    } catch (error) {
      console.log(error);
      toast.error("something Went Wrong! ");
      return;
    }
  };

  return (
    <div className="login">
      <Link to={"/"}>
        <img className="login__logo" src="BuyNest Login.png" alt="Login img" />
      </Link>
      <div className="login__container">
        <h1>Log in</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h5>Username / Agency Name</h5>
          <input type="text" ref={email} />

          <h5>Password</h5>
          <input type="password" ref={password} />

          <button
            className="login__signInButton"
            onClick={(e) => handleSubmit(e)}
          >
            {Fetching ? <LoaderNew /> : "Log In"}
          </button>
        </form>

        <span className="Register_login_text">
          Don't have an Account |{" "}
          <b
            className="Register_login_link"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </b>
        </span>
      </div>
    </div>
  );
}

export default Login;
