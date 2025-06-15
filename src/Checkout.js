import React, { useContext, useEffect, useState } from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import Bagitem from "./BagItem.js";
import { stateContext } from "./StateProvider.js";
import EmptyMessge from "./EmptyMessge.js";
import FlipMove from "react-flip-move";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import LoaderNew from "./LoaderNew.js";

function Checkout() {
  const { getCartItems, bagItems, user } = useContext(stateContext);
  const [username, setUsername] = useState("");
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  console.log(bagItems);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decode = jwtDecode(token);
      setUsername(decode.sub);
    }
    const fetchingCartItems = async () => {
      setFetching(true);
      let val = await getCartItems();
      console.log(val?.message);
      if (val?.message === 401) {
        navigate("/login");
      }
      setFetching(false);
    };

    fetchingCartItems();
  }, []);
  return (
    <div className="checkout">
      <div className="checkout__left">
        <div className="cartItems">
          <h3>Hello, {username}</h3>
          <h2 className="checkout__title"> your shopping cart</h2>

          {bagItems.length === 0 ? (
            <EmptyMessge />
          ) : (
            bagItems.map((item) => (
              <>
                {fetching ? (
                  <LoaderNew />
                ) : (
                  <Bagitem
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    quantity={item.quantity}
                    forReview={false}
                  />
                )}
              </>
            ))
          )}
        </div>
      </div>

      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
  );
}

export default Checkout;
