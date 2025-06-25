import React, { useState, useContext } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { stateContext } from "./StateProvider";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";

const ProductCard = ({
  id,
  title,
  description,
  category,
  price,
  rating,
  sellerName,
  imageData,
  imageType,
  forSeller,
  forOrder,
  forOrder_Buyer,
  Address,
  quantity,
  orderId,
  date,
  deleted,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imgsrc = `data:${imageType};base64,${imageData}`;
  const { addItems, deleteItems } = useContext(stateContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getDate = (date) => {
    let timeStamp = date;
    const newDate = new Date(timeStamp);
    const day = String(newDate.getUTCDate()).padStart(2, "0");
    const month = String(newDate.getUTCMonth()).padStart(2, "0");
    const year = newDate.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const handleAdd = () => {
    // Adding in Frontend
    addItems(id, title, price, rating);

    // API Call for adding product in Cart
    const addToCart = async () => {
      try {
        const resp = await fetch(
          `https://buynestbackend-latest.onrender.com/cart/add/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resp.status === 401) {
          // Token expired or invalid
          console.log("Token expired. Redirecting to login...");
          localStorage.removeItem("token"); // Remove invalid token
          deleteItems(id); // in case of error remove from frontend
          navigate("/login");
          return;
        }

        if (resp.ok) {
          toast.success("Added to Cart");
          console.log("Added to cart");
        }

        if (!resp.ok) {
          throw new Error(`Error ${resp.status}`);
        }
      } catch (error) {
        toast.error("An Error Occured! ");
        console.log("error!");
        deleteItems(id); // in case of error remove from frontend
      }
    };

    addToCart();
  };

  const handleClick = (id) => {
    navigate(`/dispProduct/${id}`);
  };

  const handleUpdate = (e) => {
    navigate(`/updateProduct/${id}`);
  };

  const handleDelete = () => {
    const deleteProduct = async () => {
      try {
        const resp = await fetch(
          `https://buynestbackend-latest.onrender.com/api/deleteProduct/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(resp);
        if (!resp.ok) {
          toast.error("Something Went Wrong! ");
          return;
        } else if (resp.ok) {
          toast.success("Product Deleted! ");
        }
        const respText = await resp.text();
        console.log(respText);
      } catch (error) {
        toast.error("Something Went Wrong! ");
      }
    };
    deleteProduct();
  };

  return (
    <div
      className={`card ${isHovered ? "card-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="card-image-container" onClick={() => handleClick(id)}>
        <img
          src={imgsrc}
          alt={title}
          className="card-image"
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="image-error">
            <div className="image-error-text">No Image</div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        {/* Title and Rating */}
        <div className="card-header">
          <h3 className="card-title" onClick={() => handleClick(id)}>
            {title}
          </h3>
          <div className="card-rating">
            <span className="star-icon">★</span>
            <span className="rating-text">{rating}</span>
          </div>
        </div>

        {/* Description/Address/Category */}
        <div className="card-description">
          {forOrder ? (
            <div>
              <span className="address-label">Delivery Address: </span>
              {`${Address.houseNo}, ${Address.lineOne}, ${Address.linetwo}`}
            </div>
          ) : forSeller ? (
            description
          ) : (
            <div className="product-category">{category || "GENERAL"}</div>
          )}
        </div>

        {/* Seller Info/Order Info */}
        <div className="card-info">
          {forOrder ? (
            <>
              <span>
                <span className="info-label">Created:</span> {getDate(date)}
              </span>
              <span className="quantity">×{quantity}</span>
            </>
          ) : (
            <>
              {!forSeller ? (
                <span>
                  <span className="info-label">Sold by:</span> {sellerName}
                </span>
              ) : (
                <div className="product-category">{category || "GENERAL"}</div>
              )}

              {forOrder_Buyer && <span className="quantity">×{quantity}</span>}
            </>
          )}
        </div>

        {/* Price and Actions */}
        <div className="card-footer">
          <div className="card-price">
            ₹{parseInt(price).toLocaleString("en-IN")}
          </div>

          {/* Regular Product Actions */}
          {!forSeller && !forOrder && !forOrder_Buyer && (
            <button onClick={handleAdd} className="btn-primary">
              🛒 Add to Cart
            </button>
          )}

          {/* Seller Actions */}
          {forSeller && (
            <div className="btn-group">
              <button onClick={handleDelete} className="btn-delete">
                <MdOutlineDelete />
              </button>
              <button onClick={handleUpdate} className="btn-update">
                Update
              </button>
            </div>
          )}

          {/* Order ID */}
          {forOrder && <div className="order-id">Order ID: #{orderId}</div>}
        </div>
      </div>

      {/* Deleted Overlay */}
      {deleted && (
        <div className="deleted-overlay">
          <span className="deleted-text">DELETED</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
