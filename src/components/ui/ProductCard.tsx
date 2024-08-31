import React, { useContext, useEffect, useState } from "react";
import { Avatar, Card, Rate, Button, notification, ConfigProvider } from "antd";
import styled from "styled-components";
import { FaCartArrowDown, FaHeart } from "react-icons/fa";
import { TbCategory2 } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { MdOutlineEventAvailable } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { TProduct } from "../../types/productTypes"; // Import TProduct type
import { useNavigate } from "react-router-dom";
import { CgDanger } from "react-icons/cg";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getLinearGradientButtonStyle } from "./GradientButtonStyles";
import { addToWishlist } from "../../redux/features/cart/wishlistSlice";

const { Meta } = Card;

// Styled Card Component
const StyledCard = styled(Card)`
  background-color: #f0f8e2;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  .ant-card-actions {
    background-color: #f0f8e2 !important;
  }
`;

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
  background-color: #f0f8e2;
  cursor: default; /* This will prevent the text cursor from showing */
`;

interface ProductCardProps {
  product: TProduct; // Use TProduct type
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageURL, setImageUrl] = useState<string>(
    "https://i.pinimg.com/736x/a7/3f/f6/a73ff683ac934bea92de2b1a0f6bf4db.jpg",
  );

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = getLinearGradientButtonStyle(rootPrefixCls);

  const [quantity, setQuantity] = useState<number>(1);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const checkImage = async (url: string) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          setImageUrl(url);
        }
      } catch {
        setImageUrl(
          "https://i.pinimg.com/736x/a7/3f/f6/a73ff683ac934bea92de2b1a0f6bf4db.jpg",
        );
      }
    };

    const imageUrlToCheck = product.image || "";
    if (imageUrlToCheck) {
      checkImage(imageUrlToCheck);
    }
  }, [product.image]);

  const navigate = useNavigate();

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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Calculate sale price if applicable
  const calculateSalePrice = (price: number, discountPercentage?: number) => {
    if (discountPercentage) {
      return price * (1 - discountPercentage / 100);
    }
    return price;
  };

  // Compute the sale price if on sale
  const salePrice =
    product.sale.onSale === "yes"
      ? calculateSalePrice(product.price, product.sale.onSaleDiscountPercentage)
      : undefined;

  const handleAddToWishlist = () => {
    const existingWishlistItem = wishlistItems.find(
      (item) => item.productId === product.productId,
    );

    const finalPrice =
      product.sale.onSale === "yes"
        ? product.sale.onSaleDiscountPercentage
          ? product.price * (1 - product.sale.onSaleDiscountPercentage / 100)
          : product.price
        : product.price;

    if (!existingWishlistItem) {
      dispatch(
        addToWishlist({
          productId: product.productId,
          productName: product.name,
          image: product.image,
          price: finalPrice,
        }),
      );
      notification.success({
        message: "Product added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } else {
      notification.info({
        message: "Product already in wishlist",
        description: `${product.name} is already in your wishlist.`,
      });
    }
  };

  return (
    <StyledCard
      style={{ width: 300, height: 520, margin: isMobile ? "0" : "16px", marginLeft: isMobile ? "-6vw" : "0vw"}}
      cover={
        <img
          style={{ height: 250, borderRadius: "12px" }}
          alt={product.name}
          src={imageURL}
        />
      }
      actions={[
        product.inventory.quantity > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ConfigProvider
              button={{
                className: linearGradientButton,
              }}
            >
              <Button
                type="primary"
                icon={<FaCartArrowDown />}
                onClick={handleAddToCartClick}
              >
                Add to Cart
              </Button>
            </ConfigProvider>
            <CounterContainer>
              <CounterButton onClick={() => handleQuantityChange(quantity - 1)}>
                -
              </CounterButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              />
              <CounterButton onClick={() => handleQuantityChange(quantity + 1)}>
                +
              </CounterButton>
            </CounterContainer>
          </div>
        ) : (
          <div
            style={{
              color: "red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CgDanger />
            &nbsp;<span>Out of stock</span>
          </div>
        ),
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://api.dicebear.com/9.x/icons/svg?icon=tree" />
        }
        title={
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
              window.scrollTo(0, 0);
              navigate(`/product/${product.productId}`);
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLParagraphElement).style.color = "#d1ad0d"; // Change color on hover
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLParagraphElement).style.color = "blue"; // Revert color on mouse leave
            }}
          >
            {product.name}
          </p>
        }
        description={
          <div style={{ height: 145 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Rate
                style={{ color: "#21390e" }}
                allowHalf
                disabled
                value={product.rating}
              />
              &nbsp; ({product.rating})
            </div>
            {product.sale.onSale === "yes" && (
              <>
                <GrMoney />
                &nbsp;Sale Price: <b>৳ {salePrice!.toFixed(0)}</b> <br />
                <p>
                  <BiSolidOffer />
                  <span style={{ textDecoration: "line-through" }}>
                    ৳ {product.price.toFixed(0)}
                  </span>
                  &nbsp;&nbsp;
                  <span style={{ color: "red" }}>
                    {product.sale.onSaleDiscountPercentage}% Discount
                  </span>
                </p>
              </>
            )}
            {product.sale.onSale === "no" && (
              <>
                <GrMoney />
                &nbsp;Price: <b>৳ {product.price.toFixed(0)}</b> <br />
              </>
            )}
            <TbCategory2 />
            &nbsp;{product.type} <br />
            <MdOutlineEventAvailable />
            &nbsp;Available in {product.seasonal}
            {/* Wishlist Button */}
            <Button
              type="link"
              icon={<FaHeart />}
              onClick={handleAddToWishlist}
              style={{
                color: "red",
                fontWeight: "bold",
                marginTop: "8px",
                padding: "0",
              }}
            >
              Add to Wishlist
            </Button>
          </div>
        }
      />
    </StyledCard>
  );
};

export default ProductCard;
