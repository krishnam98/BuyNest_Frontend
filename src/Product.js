import React, { useContext, useEffect, useState } from "react";
import "./Product.css";
import { stateContext } from "./StateProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Product({ id, title, price, rating, forSeller }) {
  const { addItems, deleteItems } = useContext(stateContext);
  const [url, seturl] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAdd = () => {
    //  Adding in Frontend
    addItems(id, title, price, rating);

    // API Call for adding product in Cart
    const addToCart = async () => {
      try {
        const resp = await fetch(
          `https://buynest-backend-latest-v2-latest.onrender.com/cart/add/${id}`,
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
          `https://buynest-backend-latest-v2-latest.onrender.com/api/deleteProduct/${id}`,
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

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const resp = await fetch(
          `https://buynest-backend-latest-v2-latest.onrender.com/api/product/${id}/image`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "Application/json",
            },
          }
        );

        if (resp.status === 401) {
          // Token expired or invalid
          console.log("Token expired. Redirecting to login...");
          localStorage.removeItem("token"); // Remove invalid token
          navigate("/login");
          return;
        }

        if (!resp.ok) {
          throw new Error(`Error ${resp.status}`);
        }

        // console.log("resp>>>", resp);

        const blobResp = await resp.blob();
        // console.log(blobResp);
        const urlResp = URL.createObjectURL(blobResp);
        // console.log(urlResp);
        seturl(urlResp);
      } catch (error) {}
    };

    if (token) {
      fetchImg();
    } else {
      navigate("/login");
    }

    try {
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="product">
      <div
        className="product__info"
        onClick={() => {
          handleClick(id);
        }}
      >
        <p className="product__title">{title}</p>
        <p className="product__price">
          <small>₹</small>
          <strong>{price}</strong>
        </p>

        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((i) => (
              <p>⭐</p>
            ))}
        </div>
      </div>
      <img
        src={url}
        alt=""
        onClick={() => {
          handleClick(id);
        }}
      />
      {!forSeller && (
        <button onClick={handleAdd} className="productbutton">
          add to cart
        </button>
      )}
      {forSeller && (
        <div className="buttonsDiv">
          <button className="updateBtn" onClick={handleUpdate}>
            update
          </button>
          <button className="productbutton" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default Product;
