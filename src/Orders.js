import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { stateContext } from "./StateProvider";
import OrderContainer from "./OrderContainer";
import "./Orders.css";
import Loader from "./Loader";
function Orders() {
  const [orders, setOrders] = useState([]);
  const [fetch, setFetch] = useState(false);
  let user = "";
  auth.onAuthStateChanged((authUser) => {
    console.log("user is >>>> ", authUser);
    user = authUser;
  });
  useEffect(() => {
    let temp = [];
    const getOrders = async () => {
      setFetch(true);
      const ordersArr = await getDocs(collection(db, `orders`));
      ordersArr.forEach((doc) => {
        if (doc.data().user === user?.uid) {
          temp.push(doc.data());
        }
      });
      setOrders(temp);
      setFetch(false);
      // console.log(user);
    };
    getOrders();
  }, []);

  console.log(orders);
  return (
    <div className="orders">
      {fetch ? <Loader /> : ""}
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
