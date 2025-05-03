import React, { useEffect, useRef, useState } from "react";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderNew from "./LoaderNew";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"; // We will create this utility.
import { v4 as uuidv4 } from "uuid";

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

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedFile, setCroppedFile] = useState(null);

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

  const handleChange = async (e) => {
    renderImage();
    const readFile = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.readAsDataURL(file);
      });
    };
    const file = e.target.files[0];
    if (file) {
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
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

    if (croppedFile) {
      formData.append("imageFile", croppedFile);
    } else if (imagRef.current.files[0]) {
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
      {imageSrc && (
        <div className="cropper-container">
          <div className="cropper">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Set 1 for 1:1 square, 4/3 for 4:3 etc
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
          </div>
          <div className="cropper-controls">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
            <button
              onClick={async () => {
                const cropped = await getCroppedImg(
                  imageSrc,
                  croppedAreaPixels
                );
                setCroppedFile(cropped);
                setUrl(URL.createObjectURL(cropped));
                setImageSrc(null); // close cropper
              }}
            >
              Crop & Save
            </button>
          </div>
        </div>
      )}

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

          <div className="inp">
            <span className="heading">Upload Photo</span>
            <input type="file" ref={imagRef} onChange={handleChange} />
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
