import React from "react";
import { Link } from "react-router-dom";
import Page from "../components/Shared/Page";

function About() {
  return (
    <Page title="About">
      <Link to="/">Home</Link>
    </Page>
  );
}

export default About;
