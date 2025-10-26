import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import Carousel from "../Carousel/Carousel.jsx";
import ReportIssue from "../ReportIssue/ReportIssue.jsx";
import "./index.css";

function Home() {
  return (
    <>
      <Navbar />
      <Carousel />
      <ReportIssue />
    </>
  );
}

export default Home;
