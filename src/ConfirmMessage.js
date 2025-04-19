import React from "react";
import "./ConfirmMessage.css";
import { useNavigate } from "react-router-dom";

function ConfirmMessage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="confirm_msg">
        <h1>Order Confirmed</h1>
        <p>Your Order has been created!</p>
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

export default ConfirmMessage;
