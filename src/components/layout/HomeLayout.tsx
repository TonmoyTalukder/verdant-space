import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ChatWidget from "../ChatWidget";
import { useEffect, useState } from "react";
import Notice from "../ui/Notice";
import Banner from "../ui/Banner";
import Navbar from "./Navbar";
import ResponsiveNavbar from "./ResponsiveNavbar";
import ResponsiveCart from "./ResponsiveCart";
const { Content, Footer } = Layout;

const HomeLayout = () => {
  const [isFixed, setIsFixed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const contentHeight = document.getElementById("content")!.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      setIsFixed(contentHeight > windowHeight + scrollY);
    };

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
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <>
          <ResponsiveNavbar />
          <ResponsiveCart />
        </>
      ) : (
        <>
          <div id="banner" style={{ border: "0px solid red" }}>
            <Notice />
            <Banner />
          </div>
          <Navbar />
        </>
      )}

      <Content
        id="content"
        style={{
          margin: "0 1.6% 0",
          minHeight: "calc(100vh - 134px)", // Adjust based on header and footer height
          position: "relative",
          // border: '2px solid red',
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
          }}
        >
          <Outlet />
          <ChatWidget isFixed={isFixed} />
        </div>
      </Content>
      <Footer
        style={{
          paddingTop: 20,
          textAlign: "center",
          // margin: "24px 16px 0",
        }}
      >
        VerdantSpace ©{new Date().getFullYear()} Developed by{" "}
        <a
          style={{ color: "#daa611" }}
          href="https://tonmoytalukder.github.io/"
        >
          Tonmoy Talukder
        </a>
      </Footer>
    </Layout>
  );
};

export default HomeLayout;
