import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ChatWidget from "../ChatWidget";
import { useEffect, useState } from "react";
import Notice from "../ui/Notice";
import Banner from "../ui/Banner";
import Navbar from "./Navbar";
const { Content, Footer } = Layout;

const HomeLayout = () => {
  const [isFixed, setIsFixed] = useState(true);

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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div id="banner" style={{ border: "0px solid red" }}>
        <Notice />
        <Banner />
      </div>
      <Navbar/>
      <Content
        id="content"
        style={{
          margin: "0 16px 0",
          minHeight: "calc(100vh - 134px)", // Adjust based on header and footer height
          position: "relative",
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
