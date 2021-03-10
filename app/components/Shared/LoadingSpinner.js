import React from "react";

function LoadingSpinner() {
  return (
    <div aria-label="loading" className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingSpinner;
