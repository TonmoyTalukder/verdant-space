import { Col, Image, Layout, Row } from "antd";
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
      },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: '#eaf4e5' }}>
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
          backgroundColor: "#fffff3",
          borderRadius: "25px 25px 0px 0px",
          padding: "2vh 4vw",
          boxShadow: "0 -4px 15px rgba(0, 0, 0, 0.3)",
          marginTop: 20
        }}
      >
        {/* First Section with Three Columns */}
        <Row
          gutter={[16, 16]}
          style={{ width: "100%" }}
          justify="space-between"
        >
          {/* First Column: Image and Name */}
          <Col xs={24} sm={24} md={8} lg={8} style={{ textAlign: "center" }}>
            <Image
              src="/VerdantSpace.svg"
              preview={false}
              style={{
                width: "auto",
                height: "11vh",
                objectFit: "cover",
                objectPosition: "center",
                transform: "scale(1.009)",
              }}
            />
            <h1 style={{ marginTop: "-1.5vh", color: "#21390e" }}>
              VerdantSpace
            </h1>
            <p style={{ marginTop: "1vh", color: "#21390e" }}>
              The platform that helps you to create and connect eco-friendly
              spaces.
            </p>
          </Col>

          {/* Second Column: About Us and Contact Us */}
          <Col xs={24} sm={24} md={8} lg={8} style={{ textAlign: "left" }}>
            <h3 style={{ color: "#21390e" }}>About Us</h3>
            <p style={{ color: "#555" }}>
              VerdantSpace is your go-to destination for all things green and
              serene.
            </p>
            <h3 style={{ color: "#21390e" }}>Contact Us</h3>
            <p style={{ color: "#555" }}>
              Email: contact@verdantspace.com
              <br />
              Phone: +123 456 7890
            </p>
          </Col>

          {/* Third Column: Shop, Supply Us, and Newsletter Subscription */}
          <Col xs={24} sm={24} md={8} lg={8} style={{ textAlign: "left" }}>
            <h4 style={{ color: "#21390e" }}>
              <a href="/shop" style={{ color: "#21390e" }}>
                All Products
              </a>
            </h4>
            <h4 style={{ color: "#21390e" }}>Supply Us</h4>
            <p style={{ color: "#555" }}>
              Interested in becoming a supplier?{" "}
              <a
                href="/supply"
                style={{ color: "#21390e", textDecoration: "underline" }}
              >
                Get in touch
              </a>{" "}
              with us today!
            </p>
            <h3 style={{ marginTop: "4vh", color: "#21390e" }}>
              Newsletter Subscription
            </h3>
            <p style={{ color: "#555" }}>
              Subscribe to our newsletter to get the latest updates and offers.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: "0.5vh 1vw",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "70%",
              }}
            />
            <br />
            <button
              style={{
                padding: "0.5vh 1vw",
                marginTop: "1vh",
                backgroundColor: "#21390e",
                color: "#ffffff",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </Col>
        </Row>

        {/* Second Section with Full-Width Div */}
        <div
          style={{
            padding: "1vh 2vw",
            backgroundColor: "#21390e",
            color: "#ffffff",
            borderRadius: "0px 0px 25px 25px",
            marginTop: "2vh",
            width: "100%",
            textAlign: "center",
          }}
        >
          VerdantSpace ©{new Date().getFullYear()} Developed by{" "}
          <a
            style={{ color: "#daa611" }}
            href="https://tonmoytalukder.github.io/"
          >
            Tonmoy Talukder
          </a>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomeLayout;
