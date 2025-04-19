import React, { useEffect, useRef, useState } from "react";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderNew from "./LoaderNew";

function AddProduct() {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [token, setToken] = useState("");
  const [checked, setChecked] = useState(false);
  const [url, setUrl] = useState("");
  const imagRef = useRef(null);
  const nameRef = useRef(null);
  const brandRef = useRef(null);
  const descRef = useRef(null);
  const dateRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const quantityRef = useRef(null);

  useEffect(() => {
    const tokenItem = localStorage.getItem("token");
    setToken(tokenItem);
  }, []);

  const renderImage = async () => {
    const uploadedFile = await imagRef.current.files[0];
    if (uploadedFile) {
      setUrl(URL.createObjectURL(uploadedFile));
      console.log(url);
    }
  };

  const handleChange = () => {
    renderImage();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      name: nameRef.current.value,
      description: descRef.current.value,
      brand: brandRef.current.value,
      price: priceRef.current.value,
      category: categoryRef.current.value,
      releaseDate: dateRef.current.value,
      available: checked,
      quantity: quantityRef.current.value,
      rating: 5,
    };

    const formData = new FormData();

    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    if (imagRef.current.files[0]) {
      formData.append("imageFile", imagRef.current.files[0]);
    }

    const sendData = async () => {
      try {
        setFetching(true);
        const resp = await fetch("http://localhost:8080/api/addProduct", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        setFetching(false);
        console.log(resp);
        if (resp.status === 401) {
          toast.error("logged Out!");
          navigate("/login");
          return;
        }
        if (resp.ok) {
          toast.success("Product Added! ");
          navigate("/SellerPanel");
        }
        if (!resp.ok) {
          throw new Error("something went wrong!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
        setFetching(false);
      }

      console.log(product);
    };
    sendData();
  };

  return (
    <div className="addProduct_container">
      <span className="main_heading">Add Your Product</span>
      <div className="form_container">
        <div className="img">
          <img src={url ? url : "package.png"} />
        </div>
        <form className="form">
          <div className="pair_input">
            <div className="inp">
              <span className="heading ">Name</span>
              <input placeholder="Name" className="narrow" ref={nameRef} />
            </div>
            <div className="inp">
              <span className="heading">Brand</span>
              <input placeholder="Brand " className="narrow" ref={brandRef} />
            </div>
            <div className="inp">
              <span className="heading">Release Date</span>
              <input type="date" ref={dateRef} />
            </div>
          </div>
          <div className="inp">
            <span className="heading">Description</span>
            <textarea
              className="Description"
              placeholder="description of your project "
              rows={3}
              ref={descRef}
            />
          </div>

          <div className="pair_input">
            <div className="inp">
              <span className="heading ">price</span>
              <input
                placeholder="price "
                type="number"
                step="any"
                className="narrow"
                ref={priceRef}
              />
            </div>
            <div className="inp">
              <span className="heading">Category</span>
              <input
                placeholder="Category "
                className="narrow"
                ref={categoryRef}
              />
            </div>

            <div className="inp">
              <span className="heading">Quantity</span>
              <input
                placeholder="quantity"
                className="narrow"
                type="number"
                ref={quantityRef}
              />
            </div>
          </div>
          <div className="pair_input">
            <div className="inp">
              <span className="heading">Upload Photo</span>
              <input type="file" ref={imagRef} onChange={handleChange} />
            </div>
          </div>

          <div className="pair_input">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <span className="checkmark"></span>
              <span className="label-text">Available</span>
            </label>

            <button
              onClick={(event) => {
                handleSubmit(event);
              }}
              className="addproduct_btn"
            >
              {fetching ? <LoaderNew /> : "Add to Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
