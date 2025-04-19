import React, { forwardRef, useContext, useEffect, useState } from "react";
import "./Bagitem.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { stateContext } from "./StateProvider";
import { useNavigate } from "react-router-dom";

const Bagitem = ({ id, title, quantity, price, rating }, ref) => {
  const { deleteItems } = useContext(stateContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [url, seturl] = useState("");
  const handleDelete = () => {
    deleteItems(id);
  };

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const resp = await fetch(
          `http://localhost:8080/api/product/${id}/image`,
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
    <div className="item">
      <div className="img__div">
        <img className="item_img" src={url} alt="bag item" />
      </div>
      <div className="item_info">
        <p className="item__title">{title}</p>
        <p className="item_price">
          <small>₹</small> <strong>{price}</strong>
        </p>
        <p className="item_price">
          <small>₹</small> <strong>{quantity}</strong>
        </p>

        <div className="item__rating">
          {Array(rating)
            .fill()
            .map((i) => (
              <p>⭐</p>
            ))}
        </div>

        <button className="item_button" onClick={handleDelete}>
          <DeleteOutlineIcon />
        </button>
      </div>
    </div>
  );
};

export default Bagitem;
