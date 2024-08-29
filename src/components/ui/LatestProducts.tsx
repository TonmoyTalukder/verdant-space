import React, { useContext, useEffect } from "react";
import { DownCircleOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Row, Col, Spin, Alert } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { getLinearGradientButtonStyle } from "./GradientButtonStyles";
import ProductCard from "./ProductCard";
import { TProduct } from "../../types/productTypes";
import { useGetProductsQuery } from "../../redux/features/products/productsApi";
import debounce from "lodash/debounce";

type TProductWithDate = TProduct & { updatedAt: string }; // Extend TProduct to include updatedAt

const LatestProducts: React.FC = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = getLinearGradientButtonStyle(rootPrefixCls);
  const navigate = useNavigate();

  // Fetch products data using the useGetProductsQuery hook
  const {
    data: productsData,
    error,
    isLoading,
  } = useGetProductsQuery(undefined);

  // Debounced fetch function
  const debouncedFetch = debounce(() => {
    // Trigger re-fetch here if needed
  }, 300); // Adjust debounce delay as needed

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  // Function to get the latest 8 products
  const getLatestProducts = (
    products: TProductWithDate[],
  ): TProductWithDate[] => {
    // Check if products is an array
    if (!Array.isArray(products)) {
      console.error("Products data is not an array");
      return [];
    }

    // Create a copy of the array to avoid modifying the original array
    const productsCopy = [...products];

    return productsCopy
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ) // Sort by updatedAt descending
      .slice(0, 8); // Get the latest 8 products
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error fetching products" type="error" />;
  }

  // Default to empty array if productsData or productsData.data is undefined or not an array
  const products = Array.isArray(productsData?.data) ? productsData.data : [];
  const latestProducts = getLatestProducts(products); // Get the sorted products

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    navigate("/shop", { state: { latestFilter: true } });
  };

  return (
    <div>
      <Row gutter={[24, 24]} justify="center">
        {latestProducts.map((product, index) => (
          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={index}
            xs={24} // 1 column on extra small screens (mobile)
            sm={24} // 1 column on small screens (tablets)
            md={12} // 2 columns on medium screens (desktops)
            lg={8} // 3 columns on large screens (large desktops)
            xl={6} // 4 columns on extra large screens
          >
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

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
              See all products
            </Button>
          </NavLink>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default LatestProducts;
