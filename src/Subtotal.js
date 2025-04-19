import React, { useContext } from "react";
import "./Subtotal.css";
import { stateContext } from "./StateProvider";
import { useNavigate } from "react-router-dom";

function Subtotal() {
  const { bagItems } = useContext(stateContext);
  const navigate = useNavigate();
  const className = "disabledButton";

  const getTotal = (bagItems) => {
    return bagItems?.reduce(
      (total, item) => total + Number(item.price.replace(/,/g, "")),
      0
    );
  };

  console.log(getTotal(bagItems));

  const curr = getTotal(bagItems).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div className="subtotal">
      
        
          
            <p>
              Subtotal ({bagItems.length} items):
              <strong>{curr}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" />
              This order contains gift
            </small>
          
        
      
      <button
        onClick={() => {
          navigate("/payment");
        }}
        disabled={bagItems?.length === 0}
        className={bagItems?.length === 0 ? className : "button"}
      >
        {" "}
        Proceed to checkout
      </button>
    </div>
  );
}

export default Subtotal;
