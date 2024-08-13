import React from "react";
import { NavLink } from "react-router-dom";
import { styles } from "../styles";
import { Button } from "antd";

interface ModalWindowProps {
  visible: boolean;
  isFixed: boolean;
}

const ModalWindow: React.FC<ModalWindowProps> = ({ visible, isFixed }) => {
  return (
    <div
      style={{
        ...styles.modalWindow,
        position: isFixed ? "fixed" : "absolute",
        bottom: isFixed ? "8vh" : "5vh",
        right: isFixed ? "1%" : "0",
        opacity: visible ? "1" : "0",
        visibility: visible ? "visible" : "hidden",
        transition: "opacity 0.3s ease, visibility 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <NavLink to="/admin">
          <Button type="text">Admin Login</Button>
        </NavLink>
      </div>
    </div>
  );
};

export default ModalWindow;
