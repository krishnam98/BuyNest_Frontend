import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import Product from "./Product.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader.js";
import LoaderNew from "./LoaderNew.js";
import { stateContext } from "./StateProvider.js";
import ProductCard from "./ProductCard.js";

function Home() {
  const { getCartItems } = useContext(stateContext);
  const [prodList, setProdList] = useState([]);
  const [Fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getCartItems();

    // function for Fetching List
    const fetchList = async () => {
      try {
        setFetching(true);
        const resp = await fetch("http://localhost:8080/api/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "Application/json",
          },
        });
        setFetching(false);

        if (resp.status === 401) {
          // Token expired or invalid
          console.log("Token expired. Redirecting to login...");
          localStorage.removeItem("token"); // Remove invalid token
          toast.error("Logged Out! ");
          navigate("/login");
          return;
        }

        if (!resp.ok) {
          throw new Error(`Error ${resp.status}`);
        }

        const jsonResp = await resp.json();
        console.log(jsonResp);
        setProdList(jsonResp);
      } catch (error) {
        toast.error("something Went Wrong! ");
        setFetching(false);
      }
    };

    // checking if token is there only then fetch otherwise move to login Page
    if (token) {
      fetchList();
      setFetching(false);
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <div className="home">
      <div className="home__container">
        {Fetching && <LoaderNew />}
        <div className="home__prod__container">
          {prodList.map((item) => (
            // <Product
            //   id={item.id}
            //   title={item.description}
            //   price={item.price}
            //   rating={item.rating}
            // />
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
              forSeller={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
