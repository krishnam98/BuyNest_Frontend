import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "./StateProvider";
import Bagitem from "./BagItem";
import "./payment.css";
import { Link, useNavigate } from "react-router-dom";
import Address from "./Address";
import Delivery from "./Delivery";
import Loader from "./Loader";
import { toast } from "react-toastify";
export const id = 0;
function Payment() {
  const { getCartItems, bagItems, user, address } = useContext(stateContext);
  const [processing, setProcessing] = useState(false);
  const token = localStorage.getItem("token");
  const bagData = {
    items: bagItems,
    user: user,
  };
  const navigate = useNavigate();
  console.log(bagItems);

  // calculating total amount
  const getTotal = (bagItems) => {
    return bagItems?.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
  };
  console.log(getTotal(bagItems));

  const getTotalItems = (bagItems) => {
    return bagItems.reduce((acc, item) => acc + Number(item.quantity), 0);
  };

  const curr = getTotal(bagItems).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const body = {
      houseNo: address.h_no,
      lineOne: address.line1,
      linetwo: address.line2,
      pincode: address.pincode,
    };

    const headers = {
      "content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(
        "https://buynestbackend-latest.onrender.com/order/createOrder",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      console.log(response.status);
      setProcessing(false);

      if (response.status === 401) {
        toast.error("logged Out");
        navigate("/login");
        return;
      }

      if (response.status === 201) {
        toast.success("Order Created");
        navigate("/confirmationPage");
        return;
      } else {
        throw new Error("Error Occured");
      }
    } catch (error) {
      toast.error("Error in creating Order!");
      navigate("/checkout");
      return;
    }
  };

  // --

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout(<Link to={"/checkout"}>{getTotalItems(bagItems)} items</Link>
          )
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
                quantity={item.quantity}
                forReview={true}
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
