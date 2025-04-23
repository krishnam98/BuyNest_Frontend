import React from "react";
import "./OrderContainer.css";
import OrderItems from "./OrderItems";

function OrderContainer({ info }) {
  const getDate = () => {
    let timeStamp = info.dateOfCreation;

    const date = new Date(timeStamp);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth()).padStart(2, "0");
    const year = date.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  return (
    <div className="orderContainer">
      <div className="order_info">
        <h2>created on: {getDate()} </h2>
      </div>
      <div className="orderItems">
        {info.orderItemDTO_buyerList.map((item) => (
          <OrderItems
            id={item.productDTO.id}
            title={item.productDTO.description}
            rating={item.productDTO.rating}
            imageData={item.productDTO.imageData}
            imageType={item.productDTO.imageType}
            quantity={item.quantity}
            seller={item.productDTO.sellerName}
          />
        ))}
      </div>
      <div className="orderAmt">
        <p>
          Order Total: <span className="rupee_symbol">₹</span>
          {info.price}
        </p>
        <div className="delivery">
          Delivery Address,
          <p className="paragraph">
            {`${info.address.houseNo}, ${info.address.lineOne}`}
            <span>
              {info.address.linetwo}, ({info.address.pincode})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderContainer;
