import React from "react";

// Styles for Carousel container
export const carouselContainerStyle: React.CSSProperties = {
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
};

// Styles for each Carousel item
export const carouselItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "auto",
};

// Styles for images in the Carousel
export const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  objectFit: "contain",
};

// Styles for each Column in the Row
export const colStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 0",
};

// Styles for the Row container
export const rowStyle: React.CSSProperties = {
  backgroundColor: "#cfe8cc",
  padding: "1rem",
  marginTop: "-1vh",
};
