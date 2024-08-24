import React, { useEffect, useState } from "react";
import { Avatar, Card, Rate } from "antd";
import styled from "styled-components";
import { FaCartArrowDown } from "react-icons/fa";
import { TbCategory2, TbListDetails } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { MdOutlineEventAvailable } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { TProduct } from "../../types/productTypes"; // Import TProduct type
import { useNavigate } from "react-router-dom";
import { CgDanger } from "react-icons/cg";

const { Meta } = Card;

// Styled Card Component
const StyledCard = styled(Card)`
  background-color: #cfe8cc;
  .ant-card-actions {
    background-color: #cfe8cc !important;
    .ant-card-action {
      .ant-card-action-icon {
        transition: color 0.3s; /* Smooth color transition */
      }
    }
  }
`;

interface ProductCardProps {
  product: TProduct; // Use TProduct type
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageURL, setImageUrl] = useState<string>(
    "https://i.pinimg.com/736x/a7/3f/f6/a73ff683ac934bea92de2b1a0f6bf4db.jpg",
  );

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

  // Event handler for button clicks
  const navigate = useNavigate();
  const handleViewDetails = () => {
    // console.log(key); // Log the key value
    window.scrollTo(0, 0);
    navigate(`/product/${product.productId}`);
    console.log("View Details"); // Log the key value

  };

  let cart = 0;
  const handleAddToCartClick = () => {
    // console.log(key); // Log the key value
    cart = cart + 1;
    console.log("Cart: ", cart); // Log the key value
  };

  // Inline styles with hover effect
  const iconStyle = {
    color: "#21390e",
    transition: "color 0.3s",
    display: "inline-block",
    verticalAlign: "middle",
  };

  const iconHoverStyle = {
    color: "#daa611",
  };

  // Inline styles for the button text
  const textStyle = {
    marginLeft: "8px",
    display: "inline-block",
    verticalAlign: "middle",
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

  return (
    <StyledCard
      style={{ width: 300, margin: "16px" }}
      // bodyStyle={{ backgroundColor: "#cfe8cc" }}
      cover={<img style={{ height: 250 }} alt={product.name} src={imageURL} />}
      actions={[
        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        //   key="ViewDetails"
        //   onClick={() => handleViewDetails()}
        //   onMouseOver={(e) =>
        //     (e.currentTarget.style.color = iconHoverStyle.color)
        //   }
        //   onMouseOut={(e) => (e.currentTarget.style.color = iconStyle.color)}
        // >
        //   <TbListDetails />
        //   <span style={textStyle}>View Details</span>
        // </div>,
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          key="AddToCart"
          onClick={() => handleViewDetails()}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = iconHoverStyle.color)
          }
          onMouseOut={(e) => (e.currentTarget.style.color = iconStyle.color)}
        >
          <TbListDetails />
          <span style={textStyle}>View Details</span>
        </div>,
        product.inventory.quantity > 0 ? (<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          key="AddToCart"
          onClick={() => handleAddToCartClick()}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = iconHoverStyle.color)
          }
          onMouseOut={(e) => (e.currentTarget.style.color = iconStyle.color)}
        >
          <FaCartArrowDown />
          <span style={textStyle}>Add to Cart</span>
        </div>) : (
          <div style={{ color: "red", display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
            <CgDanger />&nbsp;<span>Out of stock</span>
          </div>
        ),
      ]}
    >
      <Meta
        style={{ height: "16.5vh" }}
        avatar={
          <Avatar src="https://api.dicebear.com/9.x/icons/svg?icon=tree" />
        }
        title={
          <>
            {product.name}
            <br />
          </>
        }
        description={
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                alignContent: "center",
              }}
            >
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
                  <BiSolidOffer />{" "}
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
          </>
        }
      />
    </StyledCard>
  );
};

export default ProductCard;
