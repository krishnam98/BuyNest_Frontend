import React from "react";
import "./LoaderNew.css";
function Loader() {
  return (
    <div className="loader">
      <div className="loader">
        <svg veiwBox="0 0 400 160">
          <text
            x="50%"
            y="50%"
            dy="0.32em"
            text-anchor="middle"
            className="text-body"
          >
            BuyNest
          </text>
        </svg>
        <div className="info">
          <b>
            Do not refresh! User might Experience some Delay Because we are on
            FREE PLAN on Our Deployment Platform.
          </b>
        </div>
      </div>
    </div>
  );
}

export default Loader;
