import React from "react";
import "./OrderContainer.css";
import OrderItems from "./OrderItems";

function OrderContainer({ info }) {
  const getTotal = () => {
    return info.items?.reduce(
      (total, item) => total + Number(item.price.replace(",", "")),
      0
    );
  };
  let amt = getTotal();
  return (
    <div className="orderContainer">
      <div className="order_info">
        <h2>created on: {info.createdOn} </h2>
        <p>user's uid: {info.user}</p>
      </div>
      <div className="orderItems">
        {info.items.map((item) => (
          <OrderItems
            id={item.id}
            title={item.title}
            image={item.image}
            price={item.price}
            rating={item.rating}
          />
        ))}
      </div>
      <div className="orderAmt">
        <p>
          Order Total: <span className="rupee_symbol">₹</span>
          {amt}
        </p>
      </div>
    </div>
  );
}

export default OrderContainer;
