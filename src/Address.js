import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { stateContext } from "./StateProvider";
import "./Address.css";

function Address() {
  const { addAddress } = useContext(stateContext);
  const h_no = useRef();
  const line1 = useRef();
  const line2 = useRef();
  const pincode = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const h_no_value = h_no.current.value;
    const line1_value = line1.current.value;
    const line2_value = line2.current.value;
    const pincode_value = pincode.current.value;

    addAddress(h_no_value, line1_value, line2_value, pincode_value);
  };

  return (
    <div className="address">
      <div className="add_container">
        <form>
          {/* house No */}
          <h5>House No.</h5>
          <input type="text" required ref={h_no} />
          {/* line 1 */}
          <h5>Sector/Colony/Apartment Name</h5>
          <input type="text" required ref={line1} />
          {/* line 2 */}
          <h5>city,country</h5>
          <input type="text" required ref={line2} />

          <h5>pincode</h5>
          <input type="number" required ref={pincode} />
          {/* Button */}
        </form>
        <button onClick={(event) => handleSubmit(event)}>Add Address</button>
      </div>
    </div>
  );
}

export default Address;
