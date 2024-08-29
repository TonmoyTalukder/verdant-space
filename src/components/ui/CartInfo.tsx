/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../redux/store";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../redux/features/cart/cartSlice";
import { Button, Table } from "antd";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CounterButton = styled(Button)`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const ProceedButton = styled(Button)`
  margin-top: 20px;
  float: right;
  background-color: green;
  color: #fff;
`;

const DeleteButton = styled(Button)`
  color: red;
  border: none;
  background: none;
`;

const ScrollableTableContainer = styled.div`
  max-height: 60vh; // Adjust this value to control the table height
  width: auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px;
`;

const CartInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const auth = useSelector((state: RootState) => state.auth);

  auth;

  // Check if auth is empty
  const isAuthEmpty = !auth.role && !auth.email;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart({ productId }));
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <img
          src={text}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: { productId: string; quantity: number }) => (
        <CounterContainer>
          <CounterButton
            onClick={() =>
              handleQuantityChange(record.productId, record.quantity - 1)
            }
          >
            -
          </CounterButton>
          &nbsp;&nbsp;&nbsp;
          {record.quantity}
          &nbsp;&nbsp;&nbsp;
          <CounterButton
            onClick={() =>
              handleQuantityChange(record.productId, record.quantity + 1)
            }
          >
            +
          </CounterButton>
        </CounterContainer>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>৳ {price}</span>,
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      render: (_: any, record: { price: number; quantity: number }) => (
        <span>৳ {record.price * record.quantity}</span>
      ),
    },
    {
      title: "Remove",
      key: "remove",
      render: (_: any, record: { productId: string }) => (
        <DeleteButton
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveFromCart(record.productId)}
        />
      ),
    },
  ];

  // Handle navigation to login page
  const handleProceedToCheckout = () => {
    if (isAuthEmpty === true) {
      navigate("/login");
    } else {
      navigate("/user");
    }
  };

  return (
    <>
      {/* Scrollable container for the table */}
      <ScrollableTableContainer>
        <Table
          columns={columns}
          dataSource={cartItems.map((item) => ({
            ...item,
            key: item.productId,
          }))}
          pagination={false}
          style={{ overflow: "scroll", maxWidth: "80vw" }}
        />
      </ScrollableTableContainer>
      {/* Conditionally render the Proceed to Checkout button if cart is not empty */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {cartItems.length > 0 && (
          <ProceedButton onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </ProceedButton>
        )}
      </div>
    </>
  );
};

export default CartInfo;
