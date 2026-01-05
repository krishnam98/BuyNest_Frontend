import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateProduct() {
  const [checked, setChecked] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [updateImg, setupdateImg] = useState(false);
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const imagRef = useRef(null);
  const nameRef = useRef(null);
  const brandRef = useRef(null);
  const descRef = useRef(null);
  const dateRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const quantityRef = useRef(null);
  const { productID } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetches product from Server
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const resp = await fetch(
          `https://buynest-backend-latest-v2-latest.onrender.com/api/product/${productID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resp.status === 401) {
          toast.error("logged Out!");
          navigate("/login");
          return;
        }

        if (!resp.ok) {
          throw new Error("something Went Worng");
        }
        const jsonresp = await resp.json();
        console.log(jsonresp);
        setFetching(false);
        // Adding Default values of product in form
        nameRef.current.value = jsonresp.name;
        brandRef.current.value = jsonresp.brand;
        descRef.current.value = jsonresp.description;
        priceRef.current.value = jsonresp.price;
        categoryRef.current.value = jsonresp.category;
        quantityRef.current.value = jsonresp.quantity;
        const formattedDate = jsonresp.releaseDate.split("T")[0];
        dateRef.current.value = formattedDate;
      } catch (error) {
        toast.error("something went wrong");
        setFetching(false);
      }
    };

    // Fetching Image
    const fetchImg = async () => {
      const resp = await fetch(
        `https://buynest-backend-latest-v2-latest.onrender.com/api/product/${productID}/image`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.status === 401) {
        toast.error("logged Out!");
        navigate("/login");
        return;
      }

      if (!resp.ok) {
        throw new Error("something Went Worng");
      }

      // console.log("resp>>>", resp);
      const blobResp = await resp.blob();
      // Converting the blob to file to upload it to server (if not changed!)
      const convertedFile = new File([blobResp], "default-image.jpg", {
        type: blobResp.type,
      });

      setFile(convertedFile);
      const urlResp = URL.createObjectURL(blobResp);
      // console.log(urlResp);
      // Setting fetched image for preview
      setUrl(urlResp);
    };

    try {
      fetchProduct();
      fetchImg();
    } catch (error) {
      console.log("error", error);
      toast.error("Something Went wrong");
    }
  }, []);

  // setting the recently uploaded image to be sent for upload and preview
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

  // upload photo handler for upload button
  const handlephoto = () => {
    setupdateImg(true);
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      id: productID,
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

    // adding recently uploaded image in form else the default file retrieved from server
    if (
      imagRef.current &&
      imagRef.current.files &&
      imagRef.current.files.length > 0
    ) {
      formData.append("imageFile", imagRef.current.files[0]);
    } else {
      formData.append("imageFile", file);
    }

    // Sending data
    const sendData = async () => {
      const resp = await fetch(
        `https://buynest-backend-latest-v2-latest.onrender.com/api/updateProduct/${productID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      console.log(resp);
      if (resp.status === 401) {
        toast.error("logged Out!");
        navigate("/login");
        return;
      }
      if (resp.ok) {
        toast.success("product Updated");
        navigate("/");
      }
      if (!resp.ok) {
        throw new Error("error in updating");
      }

      const jsonResp = await resp.text();
      console.log(jsonResp);
    };

    try {
      sendData();
    } catch (error) {
      console.log("Error", error);
      toast.error("Error in updating product");
    }

    // console.log(product);
  };

  return (
    <div className="addProduct_container">
      <div className="form_container">
        <div className="img">
          <img src={url ? url : "package.png"} />
        </div>
        <form className="form">
          <span className="form-heading">Update Details</span>
          <div className="pair_input">
            <div className="inp">
              <span className="heading ">Name</span>
              <input placeholder="Name" className="narrow" ref={nameRef} />
            </div>
            <div className="inp">
              <span className="heading">Brand</span>
              <input placeholder="Brand " className="narrow" ref={brandRef} />
            </div>
          </div>

          <div className="pair_input">
            <div className="inp">
              <span className="heading">Release Date</span>
              <input type="date" ref={dateRef} />
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
            {updateImg ? (
              <div className="inp">
                <span className="heading">Upload Photo</span>
                <input type="file" ref={imagRef} onChange={handleChange} />
              </div>
            ) : (
              <button onClick={handlephoto} className="uploadbtn">
                Upload Photo
              </button>
            )}
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
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
