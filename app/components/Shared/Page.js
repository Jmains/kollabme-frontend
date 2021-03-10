import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | Kollabme`;
    window.scrollTo(0, 0);
    document.body.style.transform = "scale(1)"; // Prevent from staying zoomed in on iOS
  }, []);
  return <Container>{props.children}</Container>;
}

export default Page;
