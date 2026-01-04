import React, { useRef, useState } from "react";
import "./Login.css";
import { json, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import LoaderNew from "./LoaderNew";

function Register() {
  const [Fetching, setFetching] = useState(false);
  const [FetchingForReg, setFetchingForReg] = useState(false);
  const [checkingAvailabilty, setCheckingAvailability] = useState(false);
  const [available, setAvailable] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);
  const [checked, setChecked] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  const handleCheck = () => {
    setChecked(!checked);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const user = {
      username: email.current.value,
      password: password.current.value,
      role: checked ? "SELLER" : "USER",
    };
    console.log(user);

    const RegisterCall = async () => {
      setFetchingForReg(true);
      const resp = await fetch(
        "https://buynest-backend-latest-latest.onrender.com/auth/register",
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
      if (resp.status !== 201) {
        toast.error("something Went Wrong ");
        return;
      }

      if (resp.status === 201) {
        toast.success("Welcome! ");
        const jsonResp = await resp.json();

        localStorage.setItem("token", jsonResp.token);
        localStorage.setItem("role", jsonResp.role);

        console.log(jsonResp);
        setFetchingForReg(false);
        navigate("/");
      }
    };

    try {
      await RegisterCall();
      setFetchingForReg(false);
    } catch (error) {
      console.log(error);
      toast.error("something Went Wrong! ");
      setFetchingForReg(false);
      return;
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    const checkAvailabilty = async () => {
      try {
        setCheckingAvailability(true);
        setAvailable(false);
        setNotAvailable(false);
        const resp = await fetch(
          `https://buynest-backend-latest-latest.onrender.com/auth/checkAvailUsername/${e.target.value}`
        );
        console.log(resp.status);
        setCheckingAvailability(false);
        if (resp.status === 200) {
          setAvailable(true);
          setNotAvailable(false);
        } else if (resp.status === 406) {
          setNotAvailable(true);
          setAvailable(false);
        }
      } catch (error) {
        setCheckingAvailability(false);
        setNotAvailable(true);
        setAvailable(false);
        console.log(error);
      }
    };
    if (e.target.value.trim().length > 0) {
      checkAvailabilty();
    }
  };

  return (
    <div className="login">
      <Link to={"/"}>
        <img className="login__logo" src="BuyNest Login.png" alt="Login img" />
      </Link>
      <div className="login__container">
        <h1>Sign in</h1>
        <form>
          <h5>Full Name</h5>
          <input type="text" />
          <div className="checkbox_div" onClick={handleCheck}>
            <span className="txt_check">Register as seller</span>
            <input type="checkbox" className="inp_check" checked={checked} />
          </div>

          <h5>{checked ? "Agency Name" : "Username"}</h5>
          <input
            type="text"
            ref={email}
            onChange={(e) => {
              handleChange(e);
              setEmailValue(e.target.value);
            }}
          />
          {emailValue.length > 0 && (
            <div className={`avail_check`}>
              <span
                className={`txt_check ${
                  available ? "green" : notAvailable ? "red" : ""
                }`}
              >
                {(checkingAvailabilty && "checking Availability") ||
                  (available && "available") ||
                  (notAvailable && "Not Available")}
              </span>
            </div>
          )}

          <h5>Password</h5>
          <input
            type="password"
            ref={password}
            onChange={(e) => setPasswordValue(e.target.value)}
          />

          <button
            className="login__register"
            onClick={(e) => handleRegister(e)}
            disabled={
              emailValue.length === 0 ||
              passwordValue.length === 0 ||
              checkingAvailabilty ||
              notAvailable
            }
          >
            {FetchingForReg ? <LoaderNew /> : "Create your Amazon Account"}
          </button>
        </form>

        <span className="Register_login_text">
          Already have an Account |{" "}
          <b
            className="Register_login_link"
            onClick={() => {
              navigate("/login");
            }}
          >
            LogIn
          </b>
        </span>
      </div>
    </div>
  );
}

export default Register;
