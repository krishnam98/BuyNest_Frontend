import React, { useState, useEffect } from "react";
import "./SellerPanel.css";
import { json, useNavigate } from "react-router-dom";
import Product from "./Product";
import { toast } from "react-toastify";
import Bagitem from "./BagItem";
import ProductCard from "./ProductCard";

const SellerPanel = () => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showingProducts, setShowProducts] = useState([]);

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

        if (resp.status === 401) {
          localStorage.removeItem("token");
          toast.error("Logged Out! ");
          navigate("/login");
          return;
        }

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

    const fetchSellerOrders = async () => {
      try {
        const resp = await fetch(
          "http://localhost:8080/order/getSellerOrders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resp.status === 401) {
          localStorage.removeItem("token");
          toast.error("Logged Out! ");
          navigate("/login");
          setFetching(false);
          return;
        }

        if (!resp.ok) {
          throw new Error("Something went wrong!");
        }

        const jsonResp = await resp.json();
        setOrders(jsonResp);
        console.log(jsonResp);
        setFetching(false);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log("Error");
        setFetching(false);
      }
    };

    fetchSellerProducts();
    fetchSellerOrders();
  }, []);

  return (
    <div className="sp_seller_panel">
      {/* <header className="sp_seller_header">
        <h1 className="sp_title">Seller Dashboard</h1>
        <div className="sp_action_buttons"></div>
      </header> */}

      <div className="sp_product_management">
        <div className="sp_section">
          <h2
            className="sp_section_title"
            key={showingProducts ? "product" : "orders"}
          >
            {showingProducts ? "Product Inventory" : "Orders"}
          </h2>
          <div className="sp_action_buttons">
            <button
              className="sp_filter_Button"
              onClick={() => setShowProducts(true)}
            >
              All Products
            </button>
            <button
              className="sp_filter_Button"
              onClick={() => setShowProducts(false)}
            >
              Orders
            </button>
          </div>
        </div>

        <div className="sp_product_grid">
          {showingProducts
            ? products.map((item) => (
                <ProductCard
                  id={item.id}
                  title={item.name}
                  description={item.description}
                  price={item.price}
                  rating={item.rating}
                  sellerName={item.sellerName}
                  imageData={item.imageData}
                  imageType={item.imageType}
                  forOrder={false}
                  forSeller={true}
                />
              ))
            : orders.map((item) => (
                // <Bagitem
                //   id={item.productDTO.id}
                //   title={item.productDTO.description}
                //   price={item.productDTO.price}
                //   rating={item.productDTO.rating}
                //   quantity={item.quantity}
                //   forReview={true}
                // />
                <ProductCard
                  id={item.productDTO.id}
                  title={item.productDTO.name}
                  Address={item.address}
                  price={item.productDTO.price}
                  rating={item.productDTO.rating}
                  imageData={item.productDTO.imageData}
                  imageType={item.productDTO.imageType}
                  quantity={item.quantity}
                  orderId={item.orderID}
                  date={item.date}
                  forOrder={true}
                  forSeller={false}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
