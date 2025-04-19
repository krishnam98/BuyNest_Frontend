import React, { useContext, useEffect, useRef, useState } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useNavigate } from "react-router-dom";
import { stateContext } from "./StateProvider";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
function Header() {
  const navigate = useNavigate();
  const [classState, setClass] = useState(false);
  const [value, SetValue] = useState("");
  const [isListVisible, setListVisibility] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const listRef = useRef("");
  const { getCartItems, bagItems, user } = useContext(stateContext);

  // Getting role
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };

  const handleStyle = () => {
    setClass(!classState);
  };

  const handleInputChange = (e) => {
    SetValue(e.target.value);
    setListVisibility(e.target.value.length > 0);
    const fetchSearchItems = async () => {
      const resp = await fetch(
        `http://localhost:8080/api/searchProduct/${e.target.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResp = await resp.json();
      // console.log(jsonResp);
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

  return (
    <>
      <div className="header">
        <img
          className="header__logo"
          src="buyNest.png"
          alt="amazon-logo"
          onClick={() => {
            navigate("/");
          }}
        />

        <div className="header__search" ref={listRef}>
          <input
            className="header__searchInput"
            type="text"
            onChange={handleInputChange}
            value={value}
          />
          {isListVisible && (
            <ul className="header_SearchList">
              {searchList.map((item) => (
                <li className="header__listItem">
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

        <div className="menu">
          <button
            className={classState ? "button-menu styled" : "button-menu"}
            onClick={handleStyle}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="header__nav">
          {role === "SELLER" && (
            <Link to="/SellerPanel" className="header__link">
              <div className="header__option mobile link">
                <span className="header__optionLineOne">Admin</span>

                <span className="header__optionLineTwo">Panel</span>
              </div>
            </Link>
          )}

          <Link to={!user && "/login"} className="header__link">
            <div
              className="header__option mobile"
              onClick={handleAuthentication}
            >
              <span className="header__optionLineOne">
                {user ? user?._delegate.email : "Hello Guest"}
              </span>

              <span className="header__optionLineTwo">
                {user ? "Sign Out" : "Sign In"}
              </span>
            </div>
          </Link>
          <Link to="/orders" className="header__link">
            <div className="header__option mobile link">
              <span className="header__optionLineOne">Returns</span>

              <span className="header__optionLineTwo">& Orders</span>
            </div>
          </Link>

          <div
            className="header__optionBasket"
            onClick={() => {
              navigate("/checkout");
            }}
          >
            <ShoppingBasketIcon />
            <span className="header__optionLineTwo header__basketCount">
              {bagItems?.length}
            </span>
          </div>
        </div>
      </div>

      <div className="menu-list"></div>
      <ul className={classState ? "list styled" : "list"}>
        <li>
          <Link to={!user && "/login"} className="header__link">
            <div className="header__option " onClick={handleAuthentication}>
              <span className="header__optionLineOne">
                {user ? user?._delegate.email : "Hello Guest"}
              </span>

              <span className="header__optionLineTwo">
                {user ? "Sign Out" : "Sign In"}
              </span>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/orders" className="header__link">
            <div className="header__option link">
              <span className="header__optionLineOne">Returns</span>

              <span className="header__optionLineTwo">& Orders</span>
            </div>
          </Link>
        </li>
      </ul>
    </>
  );
}

export default Header;
