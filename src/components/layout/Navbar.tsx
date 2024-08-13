import { DownOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Dropdown, Menu, MenuProps, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const items: MenuProps["items"] = [
  {
    key: "Home",
    label: <NavLink to="/home"> Home </NavLink>,
  },
  {
    key: "Shop",
    label: <NavLink to="/shop">Shop</NavLink>,
  },
  {
    key: "Supply Us",
    label: <NavLink to="/supply">Supply Us</NavLink>,
  },
  {
    key: "Article",
    label: <NavLink to="/articles">Articles</NavLink>,
  },
  {
    key: "FAQ",
    label: <NavLink to="/faq">FAQ</NavLink>,
  },
];
const Navbar = () => {
  const [isBannerFixed, setIsBannerFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = document.getElementById("banner")!.offsetHeight;
      const scrollY = window.scrollY;

      if (scrollY > bannerHeight) {
        setIsBannerFixed(true);
      } else {
        setIsBannerFixed(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          // Layout: {
          //   /* here is your component tokens */
          //   headerHeight: 64,
          // },
          Menu: {
            itemColor: '#ffff',
            horizontalItemSelectedColor: '#daa611',
          },
          Button: {
            defaultBg: '#dfe2d200',
            defaultBorderColor: '#dfe2d200',
            defaultColor: '#fff',
          },
        },
      }}
    >
      <Header
        style={{
          position: isBannerFixed ? "fixed" : "relative",
          width: "100%",
          top: 0,
          zIndex: 1, // Ensure the header is on top of other elements
          padding: 0,
          backgroundColor: "#2f7f4b",
          // backgroundColor: "#5e9245",
        }}
      >
        {isMobile ? (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="default" style={{ marginLeft: 18 }} onClick={(e) => e.preventDefault()}>
              <Space>
                Menu
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        ) : (
          <Menu
            mode="horizontal"
            // defaultSelectedKeys={["2"]}
            items={items}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: "#2f7f4b",
            }}
          />
        )}
      </Header>
    </ConfigProvider>
  );
};

export default Navbar;
