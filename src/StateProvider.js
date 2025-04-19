import { createContext, useReducer, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  bagItems: [], //{id,title,image,price,rating}
  user: null,
  error: null,
  address: {
    h_no: "",
    line1: "",
    line2: "",
  },
  setError: () => {},
  resetError: () => {},
  addAddress: () => {},
  addItems: () => {},
  deleteItems: () => {},
  addUser: () => {},
  getCartItems: () => {},
};

export const stateContext = createContext(initialState);
const reducer = (state, action) => {
  if (action.type === "ADD-ITEM") {
    // console.log(Number(action.payload.price.replace(",", "")) + 1);

    const existingItemIndex = state.bagItems.findIndex(
      (item) => item.id === action.payload.id
    );

    if (existingItemIndex !== -1) {
      // Item already exists, increase its quantity
      const updatedItems = [...state.bagItems];
      const existingItem = updatedItems[existingItemIndex];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: (existingItem.quantity || 1) + 1,
      };

      return {
        ...state,
        bagItems: updatedItems,
      };
    }

    return {
      ...state,
      bagItems: [
        ...state.bagItems,
        {
          id: action.payload.id,
          title: action.payload.title,
          price: action.payload.price,
          rating: action.payload.rating,
          quantity: 1,
        },
      ],
    };
  } else if (action.type === "DELETE-ITEM") {
    let newBagList = state.bagItems.filter(
      (item) => item.id !== action.payload
    );
    return { ...state, bagItems: newBagList };
  } else if (action.type === "ADD-USER") {
    return { ...state, user: action.payload };
  } else if (action.type === "ADD_ADDRESS") {
    console.log(action.payload);
    return {
      ...state,
      address: {
        h_no: action.payload.h_no_val,
        line1: action.payload.line1_val,
        line2: action.payload.line2_val,
      },
    };
  } else if (action.type === "Set_Error") {
    console.log(action.payload);
    return {
      ...state,
      error: action.payload.message,
    };
  } else if (action.type === "Set_newBagItems") {
    return {
      ...state,
      bagItems: action.payload.newArr,
    };
  }

  return { state };
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItems = (id, title, price, rating) => {
    const action = {
      type: "ADD-ITEM",
      payload: {
        id,
        title,
        price,
        rating,
      },
    };
    dispatch(action);
  };

  const deleteItems = (id) => {
    const action = {
      type: "DELETE-ITEM",
      payload: id,
    };

    dispatch(action);
  };

  const addUser = (user) => {
    const action = {
      type: "ADD-USER",
      payload: user,
    };

    dispatch(action);
  };

  const addAddress = (h_no, line1, line2) => {
    const action = {
      type: "ADD_ADDRESS",
      payload: {
        h_no_val: h_no,
        line1_val: line1,
        line2_val: line2,
      },
    };
    dispatch(action);
  };

  const setError = (message) => {
    const action = {
      type: "Set_Error",
      payload: {
        message: message,
      },
    };
    dispatch(action);
  };
  const resetError = () => {
    const action = {
      type: "Set_Error",
      payload: {
        message: null,
      },
    };
    dispatch(action);
  };

  const setNewBagItems = (arr) => {
    const action = {
      type: "Set_newBagItems",
      payload: {
        newArr: arr,
      },
    };
    dispatch(action);
  };

  // API calls
  const getCartItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const resp = await fetch("http://localhost:8080/cart/getCartItems", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        // Token expired or invalid
        console.log("Token expired. Redirecting to login...");
        localStorage.removeItem("token"); // Remove invalid token
        Navigate("/login");
        return;
      }

      if (resp.ok) {
        const jsonResp = await resp.json();
        if (jsonResp != null) {
          const newBagItems = jsonResp.map((item) => ({
            id: item.id,
            title: item.description,
            price: item.price,
            rating: item.rating,
            quantity: item.quantity,
          }));

          setNewBagItems(newBagItems);
        }
        console.log(jsonResp);
      }

      if (!resp.ok) {
        throw new Error(`Error ${resp.status}`);
      }
    } catch (error) {
      toast.error("error in fetching Cart Items!");
      console.log(error);
    }
  };

  return (
    <stateContext.Provider
      value={{
        bagItems: state.bagItems,
        user: state.user,
        address: state.address,
        error: state.error,
        addItems: addItems,
        deleteItems: deleteItems,
        addUser: addUser,
        addAddress: addAddress,
        setError: setError,
        resetError: resetError,
        getCartItems: getCartItems,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};
