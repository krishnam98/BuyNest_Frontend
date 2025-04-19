import React, { useContext, useEffect, useState } from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import Bagitem from "./BagItem.js";
import { stateContext } from "./StateProvider.js";
import EmptyMessge from "./EmptyMessge.js";
import FlipMove from "react-flip-move";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout() {
  const { getCartItems, bagItems, user } = useContext(stateContext);
  console.log(bagItems);
  useEffect(() => {
    getCartItems();
  }, [bagItems.length]);
  return (
    <div className="checkout">
      <div className="checkout__left">
        <div className="cartItems">
          <h3>Hello, {user?._delegate.email}</h3>
          <h2 className="checkout__title"> your shopping cart</h2>

          {bagItems.length === 0 ? (
            <EmptyMessge />
          ) : (
            bagItems.map((item) => (
              <Bagitem
                id={item.id}
                title={item.title}
                price={item.price}
                rating={item.rating}
                quantity={item.quantity}
              />
            ))
          )}
        </div>
      </div>

      {/* <div className="checkout__right">
        <Subtotal />
      </div> */}
    </div>
  );
}

export default Checkout;
