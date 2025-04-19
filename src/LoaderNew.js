import React from "react";
import "./Loader.css"; // Make sure this file exists in the same directory

const LoaderNew = () => {
  return (
    <div className="loader-container">
      <div className="blinking-balls">
        <span className="ball"></span>
        <span className="ball"></span>
        <span className="ball"></span>
      </div>
    </div>
  );
};

export default LoaderNew;
