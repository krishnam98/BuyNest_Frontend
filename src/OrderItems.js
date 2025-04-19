import React from "react";
import "./OrderItems.css";

function OrderItems({ id, title, image, price, rating }) {
  return (
    <div className="item">
      <div className="img__div">
        <img className="item_img" src={image} alt="bag item" />
      </div>
      <div className="item_info">
        <p className="item__title">{title}</p>
        <p className="item_price">
          <small>₹</small> <strong>{price}</strong>
        </p>

        <div className="item__rating">
          {Array(rating)
            .fill()
            .map((i) => (
              <p>⭐</p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default OrderItems;
