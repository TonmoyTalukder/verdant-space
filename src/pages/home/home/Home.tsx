import React, { useState, useEffect } from "react";
import { Carousel, Col, Image as AntdImage, Row, Spin } from "antd";
import "./Home.css"; 

// Importing styles from HomeStyles.ts
import {
  carouselContainerStyle,
  carouselItemStyle,
  imageStyle,
  colStyle,
  rowStyle,
} from "./HomeStyles"; 
import MosaicImgGallery from "../../../components/MosaicImgGallery";

// Typing the src parameter as string
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new window.Image(); // Use window.Image to avoid implicit 'any' type
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve on error to prevent blocking
  });
};

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const images: string[] = [
    "/Discount Carousel.png",
    "/Discount Carousel 2.png",
    "/join.png",
    "/Delivery.png",
    "/Shipping.png",
    "/Support.png",
  ];

  useEffect(() => {
    const loadImages = async () => {
      await Promise.all(images.map((src) => preloadImage(src)));
      setLoading(false); // All images are loaded
    };

    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin
      style={{ marginTop: "5%", color: '#628753' }}
      spinning={loading}
      tip="Loading..."
      className="custom-spin"
    >
      {!loading && (
        <div>
          <div>
            <Carousel autoplay style={carouselContainerStyle}>
              <div style={carouselItemStyle}>
                <AntdImage
                  src="/Discount Carousel.png"
                  preview={false}
                  style={imageStyle}
                />
              </div>
              <div style={carouselItemStyle}>
                <AntdImage
                  src="/Discount Carousel 2.png"
                  preview={false}
                  style={imageStyle}
                />
              </div>
            </Carousel>
          </div>

          <div style={{ ...rowStyle, paddingLeft: "5%", paddingRight: "5%" }}>
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col xs={12} sm={12} md={6} lg={6} style={colStyle}>
                <Row justify="start">
                  <Col span={4}>
                    <AntdImage
                      src="/join.png"
                      preview={false}
                      style={imageStyle}
                    />
                  </Col>
                  <Col span={16} style={{ marginLeft: "3%" }}>
                    <div>
                      <b>Plants Shop, Nursery Plants & Garden</b>
                      <p>100K + tree lovers have joined with us.</p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} style={colStyle}>
                <Row justify="end">
                  <Col span={16} style={{ marginRight: "3%" }}>
                    <div style={{ textAlign: "end" }}>
                      <b>All Bangladesh Delivery</b>
                      <p>We allow any courier service in Bangladesh.</p>
                    </div>
                  </Col>
                  <Col span={4}>
                    <AntdImage
                      src="/Delivery.png"
                      preview={false}
                      style={imageStyle}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} style={colStyle}>
                <Row justify="start">
                  <Col span={4}>
                    <AntdImage
                      src="/Shipping.png"
                      preview={false}
                      style={imageStyle}
                    />
                  </Col>
                  <Col span={16} style={{ marginLeft: "3%" }}>
                    <div>
                      <b>Trusted Shipping</b>
                      <p>Providing trusted shipping with a refund policy.</p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} style={colStyle}>
                <Row justify="end">
                  <Col span={16} style={{ marginRight: "3%" }}>
                    <div style={{ textAlign: "end" }}>
                      <b>All time Support</b>
                      <p>We are supporting to making any garden in your area.</p>
                    </div>
                  </Col>
                  <Col span={4}>
                    <AntdImage
                      src="/Support.png"
                      preview={false}
                      style={imageStyle}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div style={{ padding: "1vh 10vw" }}>
            <MosaicImgGallery />
          </div>
        </div>
      )}
    </Spin>
  );
};

export default Home;
