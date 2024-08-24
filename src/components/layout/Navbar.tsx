import React, { useEffect, useState } from "react";
import { ConfigProvider, Menu, MenuProps } from "antd";
import { Header } from "antd/es/layout/layout";
import { NavLink, useLocation } from "react-router-dom";

const items: MenuProps["items"] = [
  {
    key: "/home",
    label: <NavLink to="/home">Home</NavLink>,
  },
  {
    key: "/shop",
    label: <NavLink to="/shop">Shop</NavLink>,
  },
  {
    key: "/supply",
    label: <NavLink to="/supply">Supply Us</NavLink>,
  },
  {
    key: "/articles",
    label: <NavLink to="/articles">Articles</NavLink>,
  },
  {
    key: "/faq",
    label: <NavLink to="/faq">FAQ</NavLink>,
  },
];

const Navbar = () => {
  const [isBannerFixed, setIsBannerFixed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = document.getElementById("banner")?.offsetHeight || 0;
      const scrollY = window.scrollY;

      setIsBannerFixed(scrollY > bannerHeight);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemColor: "#ffff",
            itemHoverColor: "#e3e5b5",
            horizontalItemHoverColor: "#e3e5b5",
            horizontalItemSelectedColor: "#daa611",
          },
          Button: {
            defaultBg: "#dfe2d200",
            defaultBorderColor: "#dfe2d200",
            defaultColor: "#fff",
          },
        },
      }}
    >
      <Header
        style={{
          position: isBannerFixed ? "fixed" : "relative",
          width: "100%",
          top: 0,
          zIndex: 1,
          padding: 0,
          backgroundColor: "#21390e",
        }}
      >
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]} // Set the active menu item based on current path
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: "#21390e",
            marginLeft: "2%",
            fontWeight: "900",
          }}
        />
      </Header>
    </ConfigProvider>
  );
};

export default Navbar;
