import React, { useContext, useEffect, useState } from "react";
import { stateContext, StateProvider } from "./StateProvider";
import { db } from "./firebase";
import { useLocation } from "react-router-dom";
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
  const data = localStorage.getItem("bagData");
  let error = "";
  const bagData = JSON.parse(data);
  const user = bagData?.user;
  const bagItems = bagData?.items;

  const date = new Date();

  useEffect(() => {
    const currDate = date.getDate();
    const currMonth = date.getMonth() + 1;
    const currYear = date.getFullYear();
    const addOrders = async () => {
      try {
        const docRef = await addDoc(collection(db, `orders`), {
          user: user?.uid,
          items: bagItems,
          createdOn: currDate + "/" + currMonth + "/" + currYear,
          time: date.getTime(),
        });
      } catch (error1) {
        console.log(error1);
        error = "session expired";
      }
    };
    const result = addOrders();
  }, []);

  localStorage.removeItem("bagData");

  return <>{error === "" ? <ConfirmMessage /> : <SessionExpired />}</>;
}

export default Confirm;
