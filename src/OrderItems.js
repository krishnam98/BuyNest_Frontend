import React from "react";
import "./OrderItems.css";

function OrderItems({
  id,
  title,
  rating,
  imageData,
  imageType,
  quantity,
  seller,
}) {
  const base64String = `data:${imageType};base64,${imageData}`;
  return (
    <div className="item">
      <div className="img__div">
        <img className="item_img" src={base64String} alt="bag item" />
      </div>
      <div className="item_info">
        <p className="item__title">{title}</p>
        {seller && (
          <p>
            <strong>Seller:</strong> {seller}{" "}
          </p>
        )}

        <div className="item__rating">
          {Array(rating)
            .fill()
            .map((i) => (
              <p>⭐</p>
            ))}
        </div>

        <div className="quantity-control">
          <p className="item__title">Qty :</p>

          <span className="qty-value">{quantity}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderItems;
