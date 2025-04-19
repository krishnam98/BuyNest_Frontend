import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./DispProd.css";
import { stateContext } from "./StateProvider";
import { toast } from "react-toastify";
import LoaderNew from "./LoaderNew";

function DispProd() {
  const { productID } = useParams();
  const [product, setProduct] = useState();
  const [fetching, setFetching] = useState(false);
  const [url, setUrl] = useState("");
  const { addItems } = useContext(stateContext);
  const navigate = useNavigate();
  console.log(productID);

  const token = localStorage.getItem("token");

  const handleAdd = () => {
    addItems(product?.id, product?.title, product?.price, product?.rating);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const resp = await fetch(
          `http://localhost:8080/api/product/${productID}`,
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

        if (!resp.ok) {
          throw new Error("Somthing went wrong!");
        }

        const jsonresp = await resp.json();
        console.log(jsonresp);
        setProduct(jsonresp);
        setFetching(false);
      } catch (error) {
        toast.error("Something Went Wrong!");
        console.log(error);
        setFetching(false);
      }
    };

    const fetchImg = async () => {
      try {
        const resp = await fetch(
          `http://localhost:8080/api/product/${productID}/image`,
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

        if (!resp.ok) {
          throw new Error("Somthing went wrong!");
        }

        // console.log("resp>>>", resp);
        const blobResp = await resp.blob();
        // console.log(blobResp);
        const urlResp = URL.createObjectURL(blobResp);
        // console.log(urlResp);
        setUrl(urlResp);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
    fetchImg();
  }, []);
  return (
    <div className="prod__page__container">
      {fetching && <LoaderNew />}
      <div className="image_container">
        <img src={url} alt="" className="img" />
      </div>
      <div className="detail__container">
        <div className="title">
          <p className="name">{product?.name}</p>
          <p className="desc">{product?.description}</p>
          <p>
            <b>Brand:</b> {product?.brand}
          </p>
        </div>

        <div className="rating">
          {" "}
          <b>Rating:</b>{" "}
          {Array(product?.rating)
            .fill()
            .map((i) => (
              <p>⭐</p>
            ))}
        </div>

        <p className="category">
          <b>Category:</b> <span>{product?.category}</span>
        </p>

        <p>
          {" "}
          <b className="head">Price:</b>{" "}
          <span className="value">{product?.price}</span>
        </p>
        <div className="btnDiv">
          <button onClick={handleAdd} className="addtoCart">
            add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default DispProd;
