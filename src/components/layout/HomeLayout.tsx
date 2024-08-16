import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ChatWidget from "../ChatWidget";
import { useEffect, useState, useRef } from "react";
import Notice from "../ui/Notice";
import Banner from "../ui/Banner";
import Navbar from "./Navbar";
import ResponsiveNavbar from "./ResponsiveNavbar";
import ResponsiveCart from "./ResponsiveCart";

const { Content, Footer } = Layout;

const HomeLayout = () => {
  const [isFixed, setIsFixed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFixed(!entry.isIntersecting);
      },
      {
        root: null, // Use the viewport as the container
        threshold: 0.1, // Trigger when at least 10% of the footer is visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
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
          // margin: "0 1.6% 0",
          margin: "0",
          minHeight: "calc(100vh - 134px)", // Adjust based on header and footer height
          position: "relative",
          // border: '2px solid red',
        }}
      >
        <div
          style={{
            // padding: 24,
            minHeight: 360,
          }}
        >
          <Outlet />
          <ChatWidget isFixed={isFixed} />
        </div>
      </Content>
      <Footer
        ref={footerRef}
        style={{
          paddingTop: 20,
          textAlign: "center",
          height: '20vh',
          alignContent: 'center',
          backgroundColor: '#fffff3',
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
