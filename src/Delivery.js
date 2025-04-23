import React, { useContext } from "react";
import { stateContext } from "./StateProvider";
import "./Delivery.css";

function Delivery() {
  const { address } = useContext(stateContext);

  return (
    <div className="delivery">
      {/* <p className="paragraph">
        <b>House No: </b>
        <span>{address.h_no}</span>
      </p>
      <p className="paragraph">
        <b>Sector/ Colony: </b> <span>{address.line1}</span>
      </p>
      <p className="paragraph">
        <b>City, Country: </b>
        <span>{address.line2}</span>
      </p> */}

      <p className="paragraph">
        {`${address.h_no}, ${address.line1}`}
        <span>
          {address.line2}, ({address.pincode})
        </span>
      </p>
    </div>
  );
}

export default Delivery;
