import React from "react";
import { useNavigate } from "react-router-dom";
import "./SessionExpired.css";

function SessionExpired() {
  const navigate = useNavigate();
  return (
    <>
      <div className="expired_msg">
        <h1>Session Expired</h1>
        <p>You must have Refreshed this page!</p>
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          {" "}
          Go To Store
        </button>
        <button
          onClick={() => {
            navigate("/orders");
          }}
        >
          {" "}
          Your Orders
        </button>
      </div>
    </>
  );
}

export default SessionExpired;
