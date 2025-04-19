import "./App.css";
import Checkout from "./Checkout";
import Header from "./Header";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import { useContext, useEffect } from "react";
import { auth } from "./firebase";
import { stateContext } from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";
import Confirm from "./Confirm";
import Cancel from "./Cancel.js";
import Address from "./Address.js";
import DispProd from "./DispProd.js";
import AddProduct from "./AddProduct.js";
import UpdateProduct from "./UpdateProduct.js";
import SellerPanel from "./SellerPanel.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const promise = loadStripe(
  "pk_test_51Q1nOF00ra16hNa14LUzKBlid6oM7JCg2f2aK8m6CPYcZzaSTIKVvgfFblqRGLeg9nkd1ofs7ohVYuEwRgGE5WTF00kqo7Knez"
);

function App() {
  const { addUser, user } = useContext(stateContext);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log("user is >>>> ", authUser);

      if (authUser) {
        addUser(authUser);
      } else {
        addUser(null);
      }
    });
  }, []);

  const router = createBrowserRouter([
    { path: "/", element: [<Header />, <Home />] },
    {
      path: "/payment",
      element: [
        <Header />,
        <Elements stripe={promise}>
          <Payment />
        </Elements>,
      ],
    },
    { path: "/cancelled", element: [<Cancel />] },
    { path: "/confirmationPage", element: [<Header />, <Confirm />] },
    { path: `/orders`, element: [<Header />, <Orders />] },
    { path: "/login", element: [<Login />] },
    { path: "/checkout", element: [<Header />, <Checkout />] },
    { path: "/dispProduct/:productID", element: [<Header />, <DispProd />] },
    { path: "/addProduct", element: [<AddProduct />] },
    { path: "/updateProduct/:productID", element: [<UpdateProduct />] },
    { path: "/SellerPanel", element: [<SellerPanel />] },
  ]);
  return (
    <RouterProvider router={router}>
      <div className="app"></div>
    </RouterProvider>
  );
}

export default App;
