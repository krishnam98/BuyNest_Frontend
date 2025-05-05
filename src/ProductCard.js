import { useContext } from "react";
import "./ProductCard.css";
import { TiStar } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { stateContext } from "./StateProvider";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";
const ProductCard = ({
  id,
  title,
  description,
  price,
  rating,
  sellerName,
  imageData,
  imageType,
  forSeller,
  forOrder,
  forOrder_Buyer,
  Address,
  quantity,
  orderId,
  date,
  deleted,
}) => {
  const imgsrc = `data:${imageType};base64,${imageData}`;
  const { addItems, deleteItems } = useContext(stateContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(id);

  const getDate = (date) => {
    let timeStamp = date;

    const newDate = new Date(timeStamp);
    const day = String(newDate.getUTCDate()).padStart(2, "0");
    const month = String(newDate.getUTCMonth()).padStart(2, "0");
    const year = newDate.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const handleAdd = () => {
    //  Adding in Frontend
    addItems(id, title, price, rating);

    // API Call for adding product in Cart
    const addToCart = async () => {
      try {
        const resp = await fetch(`http://localhost:8080/cart/add/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
          `http://localhost:8080/api/deleteProduct/${id}`,
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

  return (
    <>
      <div className="Card">
        {/* image */}
        <img
          src={imgsrc}
          alt="Product Img"
          className="card_img"
          onClick={() => {
            handleClick(id);
          }}
        />
        {/* section1 - product name, Rating */}
        <div className="card_section1">
          <div className="card_section1_title">{title}</div>
          <div className="card_section1_Rating">
            <TiStar color="white" />
            <span className="card_section1_rating"> {rating}</span>
          </div>
        </div>

        {/* section2 - desc/Address */}
        <div className="card_section2">
          {forOrder ? (
            <>
              <b>Delivery Address: </b>
              {`${Address.houseNo},${Address.lineOne},${Address.linetwo}`}
            </>
          ) : (
            `${description}`
          )}
        </div>
        {/* section3 - sold by/Created On */}
        <div className="card_section3">
          {forOrder ? (
            <div className="orderCard_Section3">
              <span>
                <b>Created On:</b> {`${getDate(date)}`}
              </span>
              <b>{`x${quantity}`}</b>
            </div>
          ) : (
            <div className="orderCard_Section3">
              <span>
                <b>Sold By: </b> {`${sellerName}`}
              </span>
              {forOrder_Buyer && <b>{`x${quantity}`}</b>}
            </div>
          )}
        </div>

        {/* section4 - price, buttons */}
        <div className="card_section4">
          <span className="card_section4_price">₹{price} </span>

          {!forSeller && !forOrder && !forOrder_Buyer && (
            <div className="card_section4_btns">
              <button
                className="coloredBtn"
                onClick={() => {
                  handleAdd();
                }}
              >
                Add To Cart
              </button>
            </div>
          )}
          {forSeller && (
            <div className="card_section4_btns">
              <button
                className="otherBtn"
                onClick={() => {
                  handleDelete();
                }}
              >
                <MdOutlineDelete />
              </button>

              <button
                className="coloredBtnForSeller"
                onClick={() => {
                  handleUpdate();
                }}
              >
                Update
              </button>
            </div>
          )}
          {forOrder && (
            <span className="orderId">{`OrderID: #${orderId}`}</span>
          )}
        </div>
        {deleted && (
          <div className="overlay">
            <span className="overlayText">DELETED</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCard;
