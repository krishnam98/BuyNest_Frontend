import React, { useContext, useEffect, useRef, useState } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useNavigate } from "react-router-dom";
import { stateContext } from "./StateProvider";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [classState, setClass] = useState(false);
  const [value, SetValue] = useState("");
  const [isListVisible, setListVisibility] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const listRef = useRef("");
  const { getCartItems, bagItems, user } = useContext(stateContext);

  // Getting role
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  console.log("Username:", username);

  const handleStyle = () => {
    setClass(!classState);
    console.log("clicked");
  };

  const handleClick = (id) => {
    setListVisibility(false);
    navigate(`/dispProduct/${id}`);
  };

  const handleInputChange = (e) => {
    SetValue(e.target.value);
    setListVisibility(e.target.value.length > 0);
    const fetchSearchItems = async () => {
      const resp = await fetch(
        `https://buynestbackend-latest.onrender.com/api/searchProduct/${e.target.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResp = await resp.json();
      console.log(jsonResp);
      setSearchList(jsonResp);
    };

    try {
      if (e.target.value.length > 0) {
        fetchSearchItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      const decode = jwtDecode(token);
      setUsername(decode.sub);
    }
    getCartItems();
    const handleClickOutside = (e) => {
      if (listRef.current && !listRef.current.contains(e.target)) {
        setListVisibility(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    if (localStorage.getItem("token") === null) {
      toast.success("Logged Out");
      navigate("/login");
    }
  };

  const getTotalItems = () => {
    let count = 0;
    bagItems.forEach((item) => {
      count += item.quantity;
    });

    return count;
  };

  return (
    <>
      <div className="header">
        <img
          className="header__logo"
          src="BuyNest Login.png"
          alt="BUYNEST-logo"
          onClick={() => {
            navigate("/");
          }}
        />

        {role !== "SELLER" && (
          <div className="header__search" ref={listRef}>
            <input
              className="header__searchInput"
              type="text"
              placeholder="Search Products"
              onChange={handleInputChange}
              value={value}
            />
            {isListVisible && (
              <ul className="header_SearchList">
                {searchList.map((item) => (
                  <li
                    className="header__listItem"
                    onClick={() => handleClick(item.id)}
                  >
                    <SearchIcon />
                    <span className="listSpan">{item.name}</span>
                  </li>
                ))}
                {/*              
              <li className="header__listItem">
                <SearchIcon />
                <span className="listSpan">Apple</span>
              </li>
              <li className="header__listItem">
                <SearchIcon />
                <span className="listSpan">Laptop</span>
              </li>
              <li className="header__listItem">
                <SearchIcon />
                <span className="listSpan">Asus</span>
              </li> */}
              </ul>
            )}

            <SearchIcon className="header__searchIcon" />
          </div>
        )}
        {/* {role === "SELLER" && (
          <h1 className="heading_seller">Seller Dashboard</h1>
        )} */}

        <div className="menu" onClick={handleStyle}>
          <button
            className={classState ? "button-menu styled" : "button-menu"}
            onClick={handleStyle}
          >
            <span onClick={handleStyle}></span>
            <span onClick={handleStyle}></span>
            <span onClick={handleStyle}></span>
          </button>
        </div>

        <div className="header__nav">
          <div className="header__link">
            <div className="header__option mobile">
              <span className="header__optionLineOne">
                {username ? (
                  <>
                    Hello, <b>{username}</b>
                  </>
                ) : (
                  "Hello Guest"
                )}
              </span>

              <span
                className="header__optionLineTwo"
                onClick={() => {
                  handleLogOut();
                }}
              >
                {token !== null ? "Log Out" : "Sign In"}
              </span>
            </div>
          </div>
          {role === "USER" && (
            <Link to="/orders" className="header__link">
              <div className="header__option mobile link">
                <span className="header__optionLineOne">Returns</span>

                <span className="header__optionLineTwo">& Orders</span>
              </div>
            </Link>
          )}

          {role === "SELLER" && (
            <div className="header_btns_div">
              <button
                className="Header_add_button"
                onClick={() => navigate("/addProduct")}
              >
                Add Product
              </button>

              <button
                className="Header_add_button"
                onClick={() => navigate("/analyticsPage")}
              >
                Analytics
              </button>
            </div>
          )}

          {role === "USER" && (
            <div
              className="header__optionBasket"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              <ShoppingBasketIcon />
              <span className="header__optionLineTwo header__basketCount">
                {getTotalItems()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="menu-list"></div>
      <ul className={classState ? "list styled" : "list"}>
        <li>
          <div className="header__link">
            <div className="header__option ">
              <span className="header__optionLineOne">
                {username ? username : "Hello Guest"}
              </span>

              <span className="header__optionLineTwo" onClick={handleLogOut}>
                {username ? "Sign Out" : "Sign In"}
              </span>
            </div>
          </div>
        </li>
        <li>
          {role === "USER" && (
            <Link to="/orders" className="header__link">
              <div className="header__option link">
                <span className="header__optionLineOne">Returns</span>

                <span className="header__optionLineTwo">& Orders</span>
              </div>
            </Link>
          )}
        </li>
      </ul>
    </>
  );
}

export default Header;
