import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "./StateProvider";
import Bagitem from "./BagItem";
import "./payment.css";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { db } from "./firebase";
import Address from "./Address";
import Delivery from "./Delivery";
import Loader from "./Loader";
export const id = 0;
function Payment() {
  const { bagItems, user, address } = useContext(stateContext);
  const [processing, setProcessing] = useState(false);
  const bagData = {
    items: bagItems,
    user: user,
  };
  const navigate = useNavigate();
  console.log(bagItems);

  // calculating total amount
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const stripe = await loadStripe(
      "pk_test_51Q1nOF00ra16hNa14LUzKBlid6oM7JCg2f2aK8m6CPYcZzaSTIKVvgfFblqRGLeg9nkd1ofs7ohVYuEwRgGE5WTF00kqo7Knez"
    );

    const body = {
      products: bagItems,
    };

    const headers = {
      "content-Type": "application/json",
    };

    const response = await fetch(
      "https://amazon-cklone-backend.onrender.com/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();
    setProcessing(false);
    localStorage.setItem("bagData", JSON.stringify(bagData));

    const result = stripe.redirectToCheckout({ sessionId: session.id });
  };

  // --

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout(<Link to={"/checkout"}>{bagItems?.length} items</Link>)
        </h1>
        {/* section 1- delivery address*/}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            {address.h_no === "" ? <Address /> : <Delivery />}
          </div>
        </div>

        {/* section 2- review Items */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>

          <div className="payment__items">
            {bagItems.map((item) => (
              <Bagitem
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* section 3- payment method */}
        {processing ? <Loader /> : ""}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* stripe stuff */}
            <form onSubmit={handleSubmit}>
              <div className="payment__priceContainer">
                
              
                      <p>
                        <strong>OrderTotal: {curr}</strong>
                      </p>
   
                
                <button
                  disabled={processing || address.h_no === ""}
                  className={
                    processing || address.h_no === "" ? "disabled" : "enabled"
                  }
                >
                  {processing ? "Processing.." : "Buy Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* section-4 */}
        <div className="disclaimer">
          <p>
            <b>ATTENTION!!!! </b>This Amazon Clone is for testing purpose, so
            Please make sure You enter <b>4242 4242 4242 4242</b> as your card
            number
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
