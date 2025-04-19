import React, { useContext } from "react";
import { stateContext } from "./StateProvider";

function Delivery() {
  const { address } = useContext(stateContext);

  return (
    <div className="delivery">
      <p>{address.h_no},</p>
      <p>{address.line1},</p>
      <p>{address.line2},</p>
    </div>
  );
}

export default Delivery;
