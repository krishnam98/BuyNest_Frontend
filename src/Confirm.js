import React, { useContext, useEffect, useState } from "react";
import { stateContext, StateProvider } from "./StateProvider";
import { db } from "./firebase";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getFireStore,
  addDoc,
  Collection,
  getDocs,
  collection,
} from "firebase/firestore";
import ConfirmMessage from "./ConfirmMessage";
import SessionExpired from "./SessionExpired";

function Confirm() {
  const { getCartItems } = useContext(stateContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("added");
    getCartItems();
  }, [navigate]);

  localStorage.removeItem("bagData");

  return (
    <>
      <ConfirmMessage />
    </>
  );
}

export default Confirm;
