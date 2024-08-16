import { Button, Carousel, Col, Image, Row } from "antd";

const carouselStyle: React.CSSProperties = {
  height: "42vh", // Set the height of the carousel
  width: "100%", // Ensure it takes full width
  overflow: "hidden", // Prevent content overflow
};

const buttonColStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%", // Ensure the buttons take the full height of the container
};

const Home = () => {
  return (
    <div>
      <Carousel autoplay style={carouselStyle}>
        <div
          style={{
            ...carouselStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/Discount Carousel.png"
            preview={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Ensures the image covers the carousel slide without exceeding bounds
            }}
          />
        </div>
        <div
          style={{
            ...carouselStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/Discount Carousel 2.png"
            preview={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Ensures the image covers the carousel slide without exceeding bounds
            }}
          />
        </div>
      </Carousel>
      <div style={{ backgroundColor: "#cfe8cc", height: "15vh" }}>
        <Row
          gutter={[16, 16]}
          style={{
            height: "100%", // Set the height of the Row to ensure it fills the container
          }}
        >
          <Col xs={12} sm={12} md={6} lg={6} style={buttonColStyle}>
            <Button type="primary" style={{ width: "100%" }}>
              Button 1
            </Button>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} style={buttonColStyle}>
            <Button type="primary" style={{ width: "100%" }}>
              Button 2
            </Button>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} style={buttonColStyle}>
            <Button type="primary" style={{ width: "100%" }}>
              Button 3
            </Button>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} style={buttonColStyle}>
            <Button type="primary" style={{ width: "100%" }}>
              Button 4
            </Button>
          </Col>
        </Row>
      </div>
      {/* <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1>
      <h1>This is HomeComponent.</h1> */}
    </div>
  );
};

export default Home;
