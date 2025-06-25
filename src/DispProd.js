import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DispProd.css";
import { stateContext } from "./StateProvider";
import { toast } from "react-toastify";
import LoaderNew from "./LoaderNew";
import { FaStar } from "react-icons/fa";
import { Star } from "lucide-react";

function DispProd() {
  const { productID } = useParams();
  const [product, setProduct] = useState();
  const [fetching, setFetching] = useState(false);
  const [url, setUrl] = useState("");
  const { addItems, deleteItems } = useContext(stateContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleAdd = () => {
    // Adding in Frontend
    addItems(product?.id, product?.title, product?.price, product?.rating);

    // API Call for adding product in Cart
    const addToCart = async () => {
      try {
        const resp = await fetch(
          `https://buynestbackend-latest.onrender.com/cart/add/${product?.id}`,
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
          deleteItems(product?.id); // in case of error remove from frontend
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
        deleteItems(product?.id); // in case of error remove from frontend
      }
    };

    addToCart();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const resp = await fetch(
          `https://buynestbackend-latest.onrender.com/api/product/${productID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (resp.status === 401) {
          toast.error("Logged Out!");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!resp.ok) throw new Error("Something went wrong!");
        const jsonresp = await resp.json();
        setProduct(jsonresp);
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    const fetchImg = async () => {
      try {
        const resp = await fetch(
          `https://buynestbackend-latest.onrender.com/api/product/${productID}/image`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (resp.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!resp.ok) throw new Error("Something went wrong!");
        const blobResp = await resp.blob();
        const urlResp = URL.createObjectURL(blobResp);
        setUrl(urlResp);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
    fetchImg();
  }, [productID, navigate, token]);

  return (
    <div className="modal-overlay">
      {fetching && <LoaderNew />}
      <div className="modal-content">
        <div className="modal-image">
          <img src={url} alt="product" />
        </div>
        <div className="modal-details">
          <h2 className="product-title">{product?.name}</h2>
          <p className="product-description">{product?.description}</p>

          <div className="product-meta">
            <span>
              <strong className="product-meta-h">Brand:</strong>{" "}
              {product?.brand}
            </span>
            <span>
              <strong className="product-meta-h">Category:</strong>{" "}
              {product?.category}
            </span>
          </div>

          <div className="product-meta">
            <p className="product-seller">
              <strong className="product-meta-h">Seller:</strong>{" "}
              {product?.sellerName}
            </p>
            <div className="product-rating">
              <strong className="product-meta-h">Rating:</strong>
              {Array(product?.rating)
                .fill()
                .map((_, i) => (
                  <FaStar color="#ffc107" />
                ))}
            </div>
          </div>

          <div className="product-footer">
            <p className="product-price">
              <strong>Price:</strong> ₹{product?.price}
            </p>

            {role === "USER" && (
              <button className="add-cart-btn" onClick={handleAdd}>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DispProd;
