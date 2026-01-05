import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { stateContext } from "./StateProvider";
import OrderContainer from "./OrderContainer";
import "./Orders.css";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Orders() {
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        setFetching(true);
        const resp = await fetch(
          "https://buynest-backend-latest-v2-latest.onrender.com/order/getOrders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resp.status === 401) {
          // Token expired or invalid
          console.log("Token expired. Redirecting to login...");
          localStorage.removeItem("token"); // Remove invalid token
          toast.error("Logged Out! ");
          navigate("/login");
          setFetching(false);
          return;
        }

        if (!resp.ok) {
          throw new Error(`Error ${resp.status}`);
        }

        const jsonResp = await resp.json();
        console.log(jsonResp);
        setOrders(jsonResp);
        setFetching(false);
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
    };

    fetchOrders();
  }, []);

  // console.log(orders);
  return (
    <div className="orders">
      {fetching ? <Loader /> : ""}
      <h1>Orders</h1>
      <div className="order__container">
        {orders?.length === 0 ? (
          <h1>No Orders Yet!</h1>
        ) : (
          orders.map((item) => <OrderContainer info={item} />)
        )}
      </div>
    </div>
  );
}

export default Orders;
