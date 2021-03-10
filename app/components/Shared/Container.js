import React from "react";

function Container(props) {
  return <div className="mx-auto pb-20 max-w-screen-xl">{props.children}</div>;
}

export default Container;
