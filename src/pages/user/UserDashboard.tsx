/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  InputNumber,
  Table,
  Input,
  notification,
  Modal,
  Select,
  Form,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  clearCart,
  removeFromCart,
  updateCartQuantity,
} from "../../redux/features/cart/cartSlice";
import { useGetSingleUserQuery } from "../../redux/features/users/users.Api";
import {
  useAddOrderMutation,
  useUpdateOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { useGetProductsQuery } from "../../redux/features/products/productsApi";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setOrderId,
  selectOrderId,
  setOrderProducts,
  setOrderedTotalPrice,
} from "../../redux/features/orders/ordersSlice";
import { TProduct } from "../../types/productTypes";

// Styled components
const CounterContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CounterButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteButton = styled(Button)`
  color: red;
  border: none;
  background: none;
`;

const ProceedButton = styled(Button)`
  margin-top: 20px;
  float: right;
  background-color: green;
  color: #fff;
`;

const ScrollableTableContainer = styled.div`
  max-height: 60vh;
  width: 80vw;
  overflow-y: auto;
`;

const SummaryTableContainer = styled.div`
  width: 300px;
  margin-top: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  background-color: #fafafa;
`;

const UserDashboard = () => {
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [addOrder] = useAddOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const searchingEmail = useSelector((state: RootState) => state.auth.email);
  const orderId = useSelector(selectOrderId);
  const orderedProducts = useSelector(
    (state: RootState) => state.order.products,
  );
  const orderedPrice = useSelector((state: RootState) => state.order.price);

  const { data: user } = useGetSingleUserQuery(searchingEmail, {
    skip: !searchingEmail,
  });
  const userDetails = user?.data;

  // Fetch all products at once instead of individually
  const { data: productsData } = useGetProductsQuery(undefined);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Apply discount based on coupon code
  useEffect(() => {
    if (coupon === "1ST1M") {
      setDiscount(subtotal * 0.35);
    } else {
      setDiscount(0);
    }
  }, [coupon, subtotal]);

  // Calculate total payable amount
  useEffect(() => {
    const deliveryFee = 100;
    setTotalAmount(subtotal - discount + deliveryFee);
  }, [subtotal, discount]);

  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart({ productId }));
  };

  // Handle stock availability by comparing with fetched product data
  const checkStockAvailability = () => {
    const products = productsData?.data || []; // productsData is an array directly
    for (const item of cartItems) {
      const product = products.find(
        (p: TProduct) => p.productId === item.productId,
      ); // Compare productId with cartItems
    
      if (!product || product.inventory.quantity < item.quantity) {
        return { success: false, product }; // product could be undefined
      }
    }
    return { success: true };
  };

  const handleProceedToCheckout = async () => {
    // Ensure userDetails is not undefined and has an id
    if (!userDetails || !userDetails._id) {
      console.error("User details or user ID is missing");
      return;
    }

    const stockAvailability = checkStockAvailability();
    if (!stockAvailability.success) {
      notification.error({
        message: "Stock Unavailable",
        description: stockAvailability.product
          ? `Product ${stockAvailability.product.name} is out of stock.`
          : "One or more products are out of stock.",
      });
      return;
    }

    // Proceed to checkout with a placeholder payment method
    const finalOrder = {
      userId: userDetails._id,
      products: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      address: userDetails.address,
      payment: {
        method: "Not Selected", // Use a placeholder for payment method
        status: "unpaid",
        price: totalAmount,
      },
      order: {
        status: "pending",
        delivery: false,
        adminApproval: false,
        checkoutStatus: false,
      },
      isDeleted: false,
    };

    try {
      const response = await addOrder(finalOrder).unwrap();
      const orderId = response.data._id;
      dispatch(setOrderId(orderId));
      dispatch(
        setOrderProducts(
          cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        ),
        dispatch(setOrderedTotalPrice(totalAmount)),
      );
      notification.success({
        message: "Order Confirmed",
        description: "Your order has been successfully placed!",
      });
      dispatch(clearCart()); // Clear the cart
      setIsModalVisible(true); // Show payment method modal after order is placed
    } catch (error) {
      console.error("Order placement failed:", error);
      notification.error({
        message: "Order Failed",
        description: "There was an issue placing your order.",
      });
    }
  };

  const handlePaymentProceed = async () => {
    if (paymentMethod && orderId) {
      const isCOD = paymentMethod === "COD";

      const finalOrder = {
        userId: userDetails._id,
        products: orderedProducts, // Use products stored in Redux slice
        address: userDetails.address,
        payment: {
          method: paymentMethod,
          status: isCOD ? "unpaid" : "paid",
          price: orderedPrice,
        },
        order: {
          status: "confirm",
          delivery: false,
          adminApproval: false,
          checkoutStatus: true,
        },
        isDeleted: false,
      };

      try {
        await updateOrder({ id: orderId, body: finalOrder }).unwrap();
        notification.success({
          message: "Payment Successful",
          description: "Your payment was successfully processed!",
        });
        navigate("/user/orders");
      } catch (error) {
        notification.error({
          message: "Payment Error",
          description: "There was an issue processing your payment.",
        });
      }
    } else {
      notification.error({
        message: "Payment Error",
        description: "Please select a payment method.",
      });
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
    navigate("/user/orders");
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
          &nbsp;
          <InputNumber
            min={1}
            value={record.quantity}
            disabled={true}
            onChange={(value) =>
              handleQuantityChange(record.productId, value as number)
            }
          />
          &nbsp;
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

  const summaryData = [
    { label: "Subtotal", value: `৳ ${subtotal.toFixed(2)}` },
    { label: "Discount", value: `-৳ ${discount.toFixed(2)}` },
    { label: "Delivery Fee", value: `+৳ 100` },
    {
      label: "Total Payable",
      value: `৳ ${totalAmount.toFixed(2)}`,
      bold: true,
    },
  ];

  const summaryColumns = [
    {
      dataIndex: "label",
      key: "label",
      render: (text: string) => <span>{text}</span>,
    },
    {
      dataIndex: "value",
      key: "value",
      render: (text: string, record: any) => (
        <span style={record.bold ? { fontWeight: "bold" } : {}}>{text}</span>
      ),
    },
  ];

  return (
    <div style={{ maxHeight: "78vh", overflow: "scroll" }}>
      <h1>Hello {userDetails?.name},</h1>
      <br />
      {cartItems.length > 0 ? (
        <p style={{ fontStyle: "italic", fontWeight: 500, fontSize: "2vh" }}>
          Confirm your order, and select a payment method to get your product
          delivered soon!
        </p>
      ) : (
        <p style={{ fontStyle: "italic", fontWeight: 500, fontSize: "2vh" }}>
          Your cart is empty. Add some products and place an order to enjoy our
          services!
        </p>
      )}
      <br />
      <br />
      <br />
      <ScrollableTableContainer>
        <Table
          columns={columns}
          dataSource={cartItems.map((item) => ({
            ...item,
            key: item.productId,
          }))}
          pagination={false}
          style={{ maxWidth: "80vw", borderRadius: "5px" }}
        />
      </ScrollableTableContainer>
      <br />
      {cartItems.length > 0 && (
        <SummaryTableContainer>
          <Input
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <Table
            columns={summaryColumns}
            dataSource={summaryData}
            pagination={false}
            showHeader={false}
            size="small"
          />
        </SummaryTableContainer>
      )}
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cartItems.length > 0 && (
          <ProceedButton onClick={handleProceedToCheckout}>
            Confirm Order
          </ProceedButton>
        )}
      </div>

      <Modal
        title="Proceed with Payment?"
        visible={isModalVisible}
        onOk={handlePaymentProceed}
        onCancel={handleModalCancel}
      >
        <Form>
          <Form.Item label="Select Payment Method">
            <Select onChange={(value) => setPaymentMethod(value)}>
              <Select.Option value="COD">Cash on Delivery</Select.Option>
              <Select.Option value="Online">Online Payment</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
