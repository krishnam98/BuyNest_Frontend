import React from "react";
import "./OrderContainer.css";
import OrderItems from "./OrderItems";
import ProductCard from "./ProductCard";

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
      <div className="order_info_section">
        <div className="order_info">
          <span className="orderid">
            orderID: <b>#{info.orderID}</b>
          </span>
          <p className="price">
            order Total:{" "}
            <b>
              <span className="rupee_symbol">₹</span>
              {info.price}
            </b>
          </p>
          <p className="date_order">
            created on: <b>{getDate()}</b>{" "}
          </p>
        </div>
        <div className="delivery_Order">
          <b>Delivery Address: </b>
          <p className="paragraph_Order">
            {`${info.address.houseNo}, ${info.address.lineOne},`}
            <span>
              {info.address.linetwo}, ({info.address.pincode})
            </span>
          </p>
        </div>
      </div>
      <div className="orderItems">
        {info.orderItemDTO_buyerList.map((item) => (
          <ProductCard
            id={item.productDTO.id}
            title={item.productDTO.name}
            price={item.productDTO.price}
            description={item.productDTO.description}
            rating={item.productDTO.rating}
            imageData={item.productDTO.imageData}
            imageType={item.productDTO.imageType}
            quantity={item.quantity}
            sellerName={item.productDTO.sellerName}
            forSeller={false}
            forOrder={false}
            forOrder_Buyer={true}
            deleted={item.productDTO.deleted}
          />
        ))}
      </div>
      <div className="orderAmt"></div>
    </div>
  );
}

export default OrderContainer;
