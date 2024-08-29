/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext, Key } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useSearchProductsQuery,
} from "../../redux/features/products/productsApi";
import {
  Card,
  Col,
  Row,
  Image,
  Typography,
  Rate,
  ConfigProvider,
  Button,
  Table,
  Tag,
  Carousel,
  notification,
} from "antd";
import { GrMoney } from "react-icons/gr";
import { BiSolidOffer } from "react-icons/bi";
import { getLinearGradientButtonStyle } from "../../components/ui/GradientButtonStyles";
import { FaCartArrowDown } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import ProductCard from "../../components/ui/ProductCard";
import { MdCategory } from "react-icons/md";
import { TProduct } from "../../types/productTypes";
import { PiArticleNyTimesBold } from "react-icons/pi";
import { CgDanger } from "react-icons/cg";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetArticlesQuery } from "../../redux/features/articles/articlesApi";

export interface ArticleContent {
  type: "image" | "text";
  value: string;
  imageDescription?: string;
}

export interface Article {
  _id: any;
  title: string;
  authorName: string;
  content: ArticleContent[];
  tags: string[];
}

const Product = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = getLinearGradientButtonStyle(rootPrefixCls);
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Fetch the single product by productId using the hook
  const {
    data: productResponse,
    error,
    isLoading,
  } = useGetSingleProductQuery(productId);
  const product = productResponse?.data;

  const { data: productsData } = useGetProductsQuery(undefined);

  const topOrderedProducts =
    productsData?.data
      ?.slice() // Create a shallow copy to avoid mutating the original array
      .sort(
        (a: { orderedQuantity: number }, b: { orderedQuantity: number }) =>
          b.orderedQuantity - a.orderedQuantity,
      ) // Sort by orderedQuantity
      .slice(0, 3) || []; // Get the top 3 products

  const productType = product?.type;

  const { data: searchResults } = useSearchProductsQuery(
    { searchTerm: productType, type: productType },
    {
      skip: !productType, // Skip query if the type is missing
    },
  );

  // Fetch the articles using the query hook
  const { data } = useGetArticlesQuery(undefined);
  data?.data;
  // Assuming data contains an array of articles
  const articles: Article[] = data?.data.slice(0, 3); // Get the latest 3 articles

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize selectedImage state after the product is loaded
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    // Set the initial selected image when product is fetched
    if (product && product.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching product details!</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }

  const thumbnailImages = [product.image, ...product.placeholderImages];
  const { Text } = Typography;

  // Table Data
  const tableData = [
    {
      key: "1",
      label: "Season",
      value: product.seasonal,
    },
    {
      key: "2",
      label: "Type",
      value: product.type,
    },
    {
      key: "3",
      label: "Stock",
      value:
        product.inventory.quantity > 0 ? (
          product.inventory.quantity
        ) : (
          <div
            style={{
              color: "red",
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <span>Out of stock</span>
          </div>
        ),
    },
  ];

  // Table Columns
  const tableColumns = [
    {
      dataIndex: "label",
      key: "label",
      width: "30%",
      align: "left" as const,
      render: (text: string) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      dataIndex: "value",
      key: "value",
      align: "left" as const,
    },
  ];

  const relatedProducts =
    searchResults?.data.filter((p: TProduct) => p.productId !== productId) ||
    [];

  const tableStyle = {
    width: windowWidth <= 768 ? "45vw" : "15vw", // Adjust the breakpoint as needed
  };

  const CounterContainer = styled.div`
    display: flex;
    align-items: center;
    margin-left: 16px;
  `;

  const CounterButton = styled(Button)`
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  `;

  const QuantityInput = styled.input.attrs({ readOnly: true })`
    width: 40px;
    text-align: center;
    border: none;
    outline: none;
    font-size: 16px;
    margin: 0 8px;
    // background-color: #f0f8e2;
    cursor: default; /* This will prevent the text cursor from showing */
  `;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCartClick = () => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.productId,
    );

    const finalPrice =
      product.sale.onSale === "yes"
        ? product.sale.onSaleDiscountPercentage
          ? product.price * (1 - product.sale.onSaleDiscountPercentage / 100)
          : product.price
        : product.price;

    if (existingItem) {
      // Replace the existing item's quantity with the new one
      dispatch(
        addToCart({
          productId: product.productId,
          productName: product.name,
          image: product.image,
          price: finalPrice,
          quantity, // Replace the existing quantity with the new quantity
        }),
      );
      notification.info({
        message: "Product quantity updated",
        description: `Quantity updated to ${quantity}`,
      });
    } else {
      // Add new item to cart
      dispatch(
        addToCart({
          productId: product.productId,
          productName: product.name,
          image: product.image,
          price: finalPrice,
          quantity,
        }),
      );
      notification.success({
        message: "Product added to cart",
        description: `${product.name} added to cart with quantity ${quantity}`,
      });
    }
  };

  return (
    <div style={{ margin: " 2vh 2vw" }}>
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          {/* First Column: Product Image and Thumbnails */}
          <Col sm={24} xs={24} md={24} lg={17}>
            <Card bordered={false}>
              <Row gutter={[16, 16]}>
                {/* Main Image */}
                <Col
                  sm={24}
                  xs={24}
                  md={9}
                  style={{
                    display: "flex",
                    justifyContent: "center", // Center the image horizontally
                    alignItems: "center", // Center the image vertically
                    flexDirection: "column",
                  }}
                >
                  <Row
                    gutter={[16, 16]}
                    style={{
                      border: "1px solid #628753",
                      borderRadius: "4px",
                      backgroundColor: "#cfe8cc",
                      width: "100%",
                    }}
                  >
                    <Col
                      sm={24}
                      xs={24}
                      md={24}
                      style={{
                        display: "flex",
                        justifyContent: "center", // Center the image horizontally
                        alignItems: "center", // Center the image vertically
                      }}
                    >
                      <Image
                        src={selectedImage}
                        alt={product.name}
                        width="auto"
                        height="35vh"
                        style={{
                          objectFit: "cover",
                          display: "block",
                          maxWidth: "100%", // Ensure the image fits within its container
                        }}
                      />
                    </Col>
                  </Row>

                  {/* Thumbnail Images */}
                  <Row
                    gutter={[16, 16]}
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "left",
                      width: "100%",
                    }}
                  >
                    {thumbnailImages.map((image, index) => (
                      <Col key={index} xs={6} sm={6} md={4}>
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width="50px" // Ensure square dimensions
                          height="50px"
                          style={{
                            cursor: "pointer",
                            objectFit: "cover",
                            border:
                              selectedImage === image
                                ? "2px solid gold" // Only selected image has the golden border
                                : "2px solid transparent", // Non-selected images have no border
                            borderRadius: "4px", // Slightly rounded corners
                          }}
                          onClick={() => setSelectedImage(image)} // Update main image on click
                        />
                      </Col>
                    ))}
                  </Row>
                </Col>

                {/* Product Details */}
                <Col sm={24} xs={24} md={15}>
                  <p
                    style={{
                      display: "flex", // Flexbox layout
                      justifyContent: "space-between", // Space between both columns
                      alignItems: "center", // Align items vertically in the center
                    }}
                  >
                    {/* First Column: Product Name */}
                    <span style={{ fontSize: "6vh", fontWeight: "650" }}>
                      {product.name}
                    </span>

                    {/* Second Column: Product Rating */}
                    <span
                      style={{
                        fontSize: "2.5vh",
                        textAlign: "left", // Left-align text inside the second column
                        padding: "4px", // Add some padding inside the border
                      }}
                    >
                      ({product.rating}){" "}
                      <Rate
                        style={{ color: "#d1ad0d" }}
                        allowHalf
                        disabled
                        value={product.rating}
                      />
                    </span>
                  </p>
                  <hr
                    style={{
                      border: "none", // Remove default border
                      borderTop: "0.2vh solid #d1ad0d", // Custom border color and thickness
                      margin: "1vh 0", // Optional margin adjustment
                    }}
                  />
                  <br />
                  {/* <Divider orientation="left" style={{ marginTop: "-0.2vh" }} /> */}
                  <p>
                    <h3>Attention:</h3>
                  </p>
                  <p>
                    Product Images are uploaded for your attention and easy to
                    recognize. If you want to see the original product Image and
                    video, just contact us.
                    <br />
                    <br />
                    <Text mark>1-3 Business days Delivery</Text>
                    <br />
                  </p>
                  <p style={{ marginTop: "1vh" }}>
                    Call +880 1700 000000 to inquire about your delivery
                    process.
                    <br />
                    <br />
                  </p>

                  {product.sale.onSale === "yes" ? (
                    <p style={{ fontSize: "2.3vh" }}>
                      <BiSolidOffer style={{ color: "#daa611" }} />
                      &nbsp;
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#7a7a77",
                        }}
                      >
                        ৳&nbsp;{product.price.toFixed(0)}
                      </span>
                      &nbsp;&nbsp;
                      <span style={{ color: "red" }}>
                        {product.sale.onSaleDiscountPercentage}% Discount
                      </span>
                      <br />
                      <GrMoney style={{ color: "#daa611" }} />
                      &nbsp;Sale Price: ৳&nbsp;
                      {(
                        product.price -
                        (product.price *
                          product.sale.onSaleDiscountPercentage) /
                          100
                      ).toFixed(0)}
                    </p>
                  ) : (
                    <p style={{ fontSize: "2.3vh" }}>
                      <GrMoney style={{ color: "#daa611" }} />
                      &nbsp;Price: ৳&nbsp;{product.price}
                    </p>
                  )}

                  <br />

                  {product.inventory.quantity > 0 ? (
                    <ConfigProvider
                      button={{
                        className: linearGradientButton,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          alignContent: "center",
                        }}
                      >
                        <Button
                          type="primary"
                          size="large"
                          icon={<FaCartArrowDown />}
                          onClick={handleAddToCartClick}
                        >
                          Add to cart
                        </Button>
                        <CounterContainer>
                          <CounterButton
                            onClick={() => handleQuantityChange(quantity - 1)}
                          >
                            -
                          </CounterButton>
                          <QuantityInput
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                              handleQuantityChange(parseInt(e.target.value))
                            }
                          />
                          <CounterButton
                            onClick={() => handleQuantityChange(quantity + 1)}
                          >
                            +
                          </CounterButton>
                        </CounterContainer>
                      </div>
                    </ConfigProvider>
                  ) : (
                    <div
                      style={{
                        color: "red",
                        fontSize: "2.3vh",
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <CgDanger />
                      &nbsp;<span>Out of stock</span>
                    </div>
                  )}
                </Col>
                {/* <Divider orientation="left" /> */}
              </Row>

              <hr
                style={{
                  border: "none", // Remove default border
                  borderTop: "0.2vh solid #d1ad0d", // Custom border color and thickness
                  margin: "3vh 0", // Optional margin adjustment
                }}
              />

              {/* Product Description */}
              <Row>
                <Col xs={24} sm={24} md={24} style={{ fontSize: "2vh" }}>
                  <b>Description: </b>{" "}
                  <hr
                    style={{
                      border: "none", // Remove default border
                      borderTop: "0.2vh solid #d7d9ce", // Custom border color and thickness
                      margin: "1vh 0", // Optional margin adjustment
                    }}
                  />
                  <p>{product.description}</p>
                  <br />
                  <div style={{ marginTop: "0px" }}>
                    {/* Table with Season, Type, and Stock */}
                    <Table
                      dataSource={tableData}
                      columns={tableColumns}
                      pagination={false}
                      size="small"
                      bordered
                      showHeader={false}
                      style={tableStyle}
                    />
                  </div>
                  <br />
                  <b>#Tags </b>{" "}
                  <hr
                    style={{
                      border: "none", // Remove default border
                      borderTop: "0.2vh solid #d7d9ce", // Custom border color and thickness
                      margin: "1vh 0", // Optional margin adjustment
                    }}
                  />
                  {product.tags.map((tag: string) => (
                    <Tag key={tag} color="green">
                      #{tag}
                    </Tag>
                  ))}
                </Col>
              </Row>
            </Card>

            {/* RELATED PRODUCTS */}
            <Col
              sm={24}
              xs={24}
              md={24}
              lg={24}
              style={{ marginTop: "2vh", padding: "" }}
            >
              <Card bordered={false} style={{ width: "100%" }}>
                <p style={{ fontSize: "3vh", fontWeight: "650" }}>
                  Related Products <MdCategory style={{ color: "#d1ad0d" }} />
                </p>
                <hr
                  style={{
                    border: "none", // Remove default border
                    borderTop: "0.2vh solid #d1ad0d", // Custom border color and thickness
                    margin: "1vh 0", // Optional margin adjustment
                  }}
                />
                {relatedProducts.length > 0 ? (
                  <Carousel autoplay>
                    {relatedProducts
                      .reduce(
                        (resultArray: any[][], item: any, index: number) => {
                          const chunkIndex = Math.floor(index / 4);

                          if (!resultArray[chunkIndex]) {
                            resultArray[chunkIndex] = []; // start a new chunk
                          }

                          resultArray[chunkIndex].push(item);

                          return resultArray;
                        },
                        [],
                      )
                      .map((batch: any[], index: Key | null | undefined) => (
                        <div key={index}>
                          <Row gutter={[24, 24]} justify="start">
                            {batch.map((product, idx) => (
                              <Col
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                key={idx}
                                xs={24} // 1 column on extra small screens (mobile)
                                sm={24} // 1 columns on small screens (tablets)
                                md={12} // 2 columns on medium screens (desktops)
                                lg={8} // 3 columns on large screens (large desktops)
                              >
                                <ProductCard product={product} />
                              </Col>
                            ))}
                          </Row>
                        </div>
                      ))}
                  </Carousel>
                ) : (
                  <p>No related products found.</p>
                )}
              </Card>
            </Col>
          </Col>

          {/* Second Column: Top Orders */}
          <Col sm={24} xs={24} md={24} lg={7}>
            <Card bordered={false}>
              <p style={{ fontSize: "3vh", fontWeight: "650" }}>
                Top Orders <BsStars style={{ color: "#d1ad0d" }} />
              </p>
              <hr
                style={{
                  border: "none",
                  borderTop: "0.2vh solid #d1ad0d",
                  margin: "1vh 0",
                }}
              />
              {topOrderedProducts.length > 0 ? (
                <div>
                  {topOrderedProducts.map((topProduct: TProduct) => (
                    <Row
                      key={topProduct.productId}
                      style={{
                        marginBottom: "1vh",
                        alignItems: "center", // Align content vertically
                      }}
                    >
                      <Col span={4}>
                        {" "}
                        {/* Adjust span to control column width */}
                        <Image
                          src={topProduct.image}
                          width="50px"
                          height="50px"
                          style={{
                            cursor: "pointer",
                            objectFit: "cover",
                            border: "2px solid gold",
                            borderRadius: "4px",
                          }}
                        />
                      </Col>

                      <Col span={8}>
                        <p
                          style={{
                            fontSize: "2vh",
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                            transition: "color 0.3s, text-decoration 0.3s", // Smooth color and underline transition
                          }}
                          onClick={() => {
                            // Navigate to the product page
                            window.location.href = `/product/${topProduct.productId}`;
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLParagraphElement).style.color =
                              "#d1ad0d"; // Change color on hover
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLParagraphElement).style.color =
                              "blue"; // Revert color on mouse leave
                          }}
                        >
                          {topProduct.name}
                        </p>
                      </Col>

                      <Col span={12}>
                        {topProduct.sale.onSale === "yes" && (
                          <>
                            <GrMoney />
                            &nbsp;Sale Price:{" "}
                            <b>
                              ৳{" "}
                              {(
                                product.price -
                                (product.price *
                                  product.sale.onSaleDiscountPercentage) /
                                  100
                              ).toFixed(0)}
                            </b>{" "}
                            <br />
                            <p>
                              <BiSolidOffer />{" "}
                              <span style={{ textDecoration: "line-through" }}>
                                ৳ {topProduct.price.toFixed(0)}
                              </span>
                              &nbsp;&nbsp;
                              <span style={{ color: "red" }}>
                                {topProduct.sale.onSaleDiscountPercentage}%
                                Discount
                              </span>
                            </p>
                          </>
                        )}
                        {topProduct.sale.onSale === "no" && (
                          <>
                            <GrMoney />
                            &nbsp;Price: <b>
                              ৳ {topProduct.price.toFixed(0)}
                            </b>{" "}
                            <br />
                          </>
                        )}
                      </Col>
                    </Row>
                  ))}
                </div>
              ) : (
                <p>No top ordered products available.</p>
              )}
            </Card>

            <Card
              bordered={false}
              style={{
                marginTop: "2vh",
                maxHeight: "134.6vh",
                overflowY: "scroll",
              }}
            >
              <p style={{ fontSize: "3vh", fontWeight: "650" }}>
                Latest Articles{" "}
                <PiArticleNyTimesBold style={{ color: "#d1ad0d" }} />
              </p>
              <hr
                style={{
                  border: "none",
                  borderTop: "0.2vh solid #d1ad0d",
                  margin: "1vh 0",
                }}
              />

              {/* Iterate over the articles and display the details */}
              {articles?.map((article, index) => {
                // Find first image and text content for each article
                const imageContent = article.content.find(
                  (c) => c.type === "image",
                );
                const textContent = article.content.find(
                  (c) => c.type === "text",
                );

                // Truncate text content if needed
                const truncatedText = textContent
                  ? textContent.value.length > 150
                    ? `${textContent.value.substring(0, 150)}...`
                    : textContent.value
                  : "";

                return (
                  <div key={index} style={{ marginBottom: "2vh" }}>
                    {/* Article Image */}
                    {imageContent && (
                      <img
                        src={imageContent.value}
                        alt={imageContent.imageDescription || article.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "0.5vh",
                        }}
                      />
                    )}

                    {/* Article Title */}
                    <p
                      style={{
                        fontSize: "2.5vh",
                        fontWeight: "600",
                        marginTop: "1vh",
                        color: "#000",
                        cursor: "pointer", // Add pointer cursor
                        transition: "color 0.3s, text-decoration 0.3s", // Smooth transitions
                      }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/article/${article._id}`);
                      }} // Navigate on click
                      onMouseEnter={(e) => {
                        (e.target as HTMLParagraphElement).style.color =
                          "#d1ad0d"; // Change color on hover
                        (
                          e.target as HTMLParagraphElement
                        ).style.textDecoration = "underline"; // Add underline on hover
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLParagraphElement).style.color = "#000"; // Revert color on mouse leave
                        (
                          e.target as HTMLParagraphElement
                        ).style.textDecoration = "none"; // Remove underline on mouse leave
                      }}
                    >
                      {article.title}
                    </p>

                    {/* Author Name */}
                    <p
                      style={{
                        fontSize: "2vh",
                        fontWeight: "500",
                        color: "#555",
                      }}
                    >
                      By {article.authorName}
                    </p>

                    {/* Article Description */}
                    <p
                      style={{
                        fontSize: "2vh",
                        fontWeight: "400",
                        color: "#333",
                      }}
                    >
                      {truncatedText}
                    </p>

                    {/* Tags */}
                    <div
                      style={{
                        display: "flex",
                        gap: "1vh",
                        marginBottom: "1vh",
                      }}
                    >
                      {article.tags.map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: "#d1ad0d",
                            color: "#fff",
                            padding: "0.5vh 1vh",
                            borderRadius: "2vh",
                            fontSize: "1.5vh",
                            fontWeight: "600",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <hr
                      style={{
                        border: "none",
                        borderTop: "0.1vh solid #eee",
                        margin: "2vh 0",
                      }}
                    />
                  </div>
                );
              })}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Product;
