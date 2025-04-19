import React from "react";
import "./Cancel.css";
import { Link, useNavigate } from "react-router-dom";

function Cancel() {
  const navigate = useNavigate();
  localStorage.removeItem("bagData");
  return (
    <div className="cancel">
      <Link to={"/"}>
        <img
          className="login__logo"
          src="https://pngimg.com/uploads/amazon/small/amazon_PNG7.png"
          alt="Login img"
        />
      </Link>

      <div className="Cancel_msg">
        <h1>Payment Cancelled!</h1>
      </div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Go To Store
      </button>
    </div>
  );
}

export default Cancel;
