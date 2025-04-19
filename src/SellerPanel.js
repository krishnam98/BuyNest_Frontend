import React, { useState, useEffect } from "react";
import "./SellerPanel.css";
import { useNavigate } from "react-router-dom";
import Product from "./Product";
import { toast } from "react-toastify";

const SellerPanel = () => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSellerProducts = async () => {
      try {
        setFetching(true);
        const resp = await fetch(
          "http://localhost:8080/api/getSellerProducts",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resp.ok) {
          throw new Error("something went wrong");
        }

        const respJson = await resp.json();
        console.log(respJson);
        setProducts(respJson);
        setFetching(false);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log("Error");
        setFetching(false);
      }
    };

    fetchSellerProducts();
  }, []);

  return (
    <div className="sp_seller_panel">
      <header className="sp_seller_header">
        <h1 className="sp_title">Seller Dashboard</h1>
        <div className="sp_action_buttons">
          <button
            className="sp_add_button"
            onClick={() => navigate("/addProduct")}
          >
            Add Product
          </button>
        </div>
      </header>

      <div className="sp_product_management">
        <h2 className="sp_section_title">Product Inventory</h2>
        <div className="sp_product_grid">
          {products.map((item) => (
            <Product
              id={item.id}
              title={item.description}
              price={item.price}
              rating={item.rating}
              forSeller={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
