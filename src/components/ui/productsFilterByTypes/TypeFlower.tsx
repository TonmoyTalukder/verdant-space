import React, { useContext } from "react";
import { Button, Carousel, Col, ConfigProvider, Row, Spin, Alert } from "antd";
import { useMediaQuery } from "react-responsive";
import { NavLink, useNavigate } from "react-router-dom";
import { DownCircleOutlined } from "@ant-design/icons";
import { TProduct } from "../../../types/productTypes";
import { getLinearGradientButtonStyle } from "../GradientButtonStyles";
import { useGetProductsQuery } from "../../../redux/features/products/productsApi";
import ProductCard from "../ProductCard";

// Utility function to batch products based on the number of items per carousel
const batchProducts = (products: TProduct[], itemsPerBatch: number) => {
  const batches = [];
  for (let i = 0; i < products.length; i += itemsPerBatch) {
    batches.push(products.slice(i, i + itemsPerBatch));
  }
  return batches;
};

const TypeFlower: React.FC = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = getLinearGradientButtonStyle(rootPrefixCls);
  const navigate = useNavigate();

  // Fetch products data using the useGetProductsQuery hook
  const { data: productsData, error, isLoading } = useGetProductsQuery(undefined);

  // Handle navigation to the shop page
  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    navigate("/shop", { state: { typeFilter: 'Flower' } });
  };

  // Define number of products per carousel for different screen sizes
  const productsPerCarousel = {
    xs: 1, // 1 product per carousel on extra small screens (mobile)
    sm: 2, // 2 products per carousel on small screens (tablets)
    md: 3, // 3 products per carousel on medium screens (desktops)
    lg: 4, // 4 products per carousel on large screens (large desktops)
  };

  // Use media queries to determine the screen size
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1024px)",
  });
  const isDesktop = useMediaQuery({
    query: "(min-width: 1025px) and (max-width: 1440px)",
  });
  const isLargeDesktop = useMediaQuery({ query: "(min-width: 1441px)" });

  // Determine the number of products per carousel based on the screen size
  let numProductsPerCarousel;
  if (isLargeDesktop) {
    numProductsPerCarousel = productsPerCarousel.lg;
  } else if (isDesktop) {
    numProductsPerCarousel = productsPerCarousel.md;
  } else if (isTablet) {
    numProductsPerCarousel = productsPerCarousel.md;
  } else {
    numProductsPerCarousel = productsPerCarousel.xs;
  }

  // Filter products to include only those on sale
  const getOnSaleProducts = (products: TProduct[]): TProduct[] => {
    return products.filter((product) => product.type === "Flower");
  };

  // Default to empty array if productsData is undefined or not an array
  const products = Array.isArray(productsData?.data) ? productsData.data : [];
  const onSaleProducts = getOnSaleProducts(products);

  // Create batches based on the number of products per carousel
  const carousels = batchProducts(onSaleProducts, numProductsPerCarousel);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error fetching products" type="error" />;
  }

  return (
    <div>
      <Carousel autoplay>
        {carousels.map((batch, index) => (
          <div key={index}>
            <Row gutter={[24, 24]} justify="center">
              {batch.map((product, idx) => (
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={idx}
                  xs={24} // 1 column on extra small screens (mobile)
                  sm={12} // 2 columns on small screens (tablets)
                  md={8} // 3 columns on medium screens (desktops)
                  lg={6} // 4 columns on large screens (large desktops)
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Carousel>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <ConfigProvider
          button={{
            className: linearGradientButton,
          }}
        >
          <NavLink to="/shop" onClick={handleNavigation}>
            <Button type="primary" size="large" icon={<DownCircleOutlined />}>
              See more Flower Plants
            </Button>
          </NavLink>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default TypeFlower;
