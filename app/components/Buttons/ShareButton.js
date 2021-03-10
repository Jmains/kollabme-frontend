import React from "react";
import { Share } from "../icons";

function ShareButton() {
  return (
    <button aria-label="share button" className="flex">
      <Share className="cursor-pointer w-5 h-5 mr-1" />
      <span className="cursor-pointer text-xs sm:text-sm">share</span>
    </button>
  );
}

export default ShareButton;
