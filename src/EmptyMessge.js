import React from "react";
import "./EmptyMessage.css";
import { useNavigate } from "react-router-dom";
function EmptyMessge() {
  const navigate = useNavigate();
  return (
    <div className="msg">
      <div className="img__msg">
        <img
          src="https://plus.unsplash.com/premium_vector-1721291624299-398d965b72d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVtcHR5JTIwYmFza2V0JTIwaWxsdXN0cmF0aW9ufGVufDB8fDB8fHww"
          alt="Empty Cart"
        ></img>
      </div>
      <div className="txt__msg">
        <h2>Your Cart is Empty!</h2>
        <h3>Please Add Items To Your Cart</h3>
        <button
          className="msg__button"
          onClick={() => {
            navigate("/");
            // navigate("/", { replace: true });  deleting the current page from history stack so that we cannot revert back to this after going to "/"
          }}
        >
          {" "}
          Go to Store
        </button>
      </div>
    </div>
  );
}

export default EmptyMessge;
