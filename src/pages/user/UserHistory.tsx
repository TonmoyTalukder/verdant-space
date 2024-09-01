/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Select, Form, Input, notification } from "antd";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { RootState } from "../../redux/store";

const UserHistory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [form] = Form.useForm();
  const searchingEmail = useSelector((state: RootState) => state.auth.email);

  // Fetch orders
  const {
    data: ordersResponse,
    error,
    isLoading,
  } = useGetOrdersQuery(undefined);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // Access the orders array
  const orders = ordersResponse?.data;

  // Filter orders by user email
  const filteredOrders = orders?.filter(
    (order: { userDetails: any; email: string | null }) => {
      return order.userDetails.email === searchingEmail;
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  // Sort orders from newest to oldest
  const sortedOrders = filteredOrders?.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleIncompleteClick = (order: any) => {
    if (order && order.products && order.payment && order.order) {
      setSelectedOrder(order);
      setIsModalVisible(true);
    } else {
      notification.error({
        message: "Order Error",
        description: "The selected order is incomplete or invalid.",
      });
    }
  };

  const handlePaymentProceed = async () => {
    if (paymentMethod && selectedOrder && selectedOrder.products) {
      try {
        // Construct the updated order object
        const updatedOrder = {
          userId: selectedOrder.userId || "", // Include userId
          products: selectedOrder.products.map((product: any) => ({
            productId: product.productId,
            quantity: product.quantity,
          })), // Ensure products array exists
          address: selectedOrder.address || "", // Include address
          payment: {
            method: paymentMethod, // Update method
            status: paymentMethod === "COD" ? "unpaid" : "paid",
            price: selectedOrder.payment?.price || 0, // Ensure price is included
          },
          order: {
            status: "confirm", // Default to "pending"
            delivery: selectedOrder.order?.delivery || false, // Default to false
            adminApproval: selectedOrder.order?.adminApproval || false, // Default to false
            checkoutStatus: true, // Set checkoutStatus to true
          },
          isDeleted: selectedOrder.isDeleted || false, // Default to false
        };

        await updateOrder({
          id: selectedOrder._id,
          body: updatedOrder,
        }).unwrap();

        notification.success({
          message: "Payment Successful",
          description: "Your payment was successfully processed!",
        });
        setIsModalVisible(false);
      } catch (error) {
        console.error("Update Order Error:", error);
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

  const handleUpdateOrder = (order: any) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      ...order,
      // Ensure to set the form fields with the existing order values
    });
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOrderSubmit = async (values: any) => {
    if (selectedOrder) {
      try {
        const updatedOrder = {
          ...selectedOrder,
          ...values,
          // Spread and override selected order with new values
        };

        await updateOrder({
          id: selectedOrder._id,
          body: updatedOrder,
        }).unwrap();

        notification.success({
          message: "Order Updated",
          description: "Your order was successfully updated!",
        });
        setIsUpdateModalVisible(false);
      } catch (error) {
        console.error("Update Order Error:", error);
        notification.error({
          message: "Update Error",
          description: "There was an issue updating your order.",
        });
      }
    }
  };

  const handleDeleteOrder = async (order: any) => {
    try {
      await deleteOrder(order._id).unwrap();
      notification.success({
        message: "Order Deleted",
        description: "The order was successfully deleted!",
      });
    } catch (error) {
      console.error("Delete Order Error:", error);
      notification.error({
        message: "Deletion Error",
        description: "There was an issue deleting the order.",
      });
    }
  };

  const handleModalClose = () => {
    setSelectedOrder(null); // Clear selected order
    setIsModalVisible(false);
  };

  const handleUpdateModalClose = () => {
    setSelectedOrder(null); // Clear selected order
    setIsUpdateModalVisible(false);
  };

  return (
    <div>
      <h1>Your Order History</h1>
      {sortedOrders?.length > 0 ? (
        <Table
          dataSource={sortedOrders}
          columns={[
            {
              title: "Order ID",
              dataIndex: "_id",
              key: "id",
            },
            {
              title: "Products Id",
              dataIndex: "products",
              key: "products",
              render: (products: any[]) => (
                <>
                  {products.map((product, index) => (
                    <li key={index}>{product.productId}</li>
                  ))}
                </>
              ),
            },
            {
              title: "Quantity",
              dataIndex: "products",
              key: "products",
              render: (products: any[]) => (
                <>
                  {products.map((product, index) => (
                    <li key={index}>{product.quantity}</li>
                  ))}
                </>
              ),
            },
            {
              title: "Total Price",
              dataIndex: "payment",
              key: "price",
              render: (payment: any) => `৳ ${payment.price}`,
            },
            {
              title: "Payment Method",
              dataIndex: "payment",
              key: "paymentMethod",
              render: (payment: any, record: any) =>
                payment.method === "Not Selected" ? (
                  <Button
                    type="primary"
                    onClick={() => handleIncompleteClick(record)}
                  >
                    Incomplete
                  </Button>
                ) : (
                  payment.method
                ),
            },
            {
              title: "Order Status",
              dataIndex: "order",
              key: "status",
              render: (order: any) => order.status,
            },
            {
              title: "Actions",
              key: "actions",
              render: (record: any) => (
                <div>
                  {record.payment.method === "Not Selected" && (
                    <>
                      <Button
                        type="link"
                        onClick={() => handleUpdateOrder(record)}
                      >
                        Update
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteOrder(record)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />
      ) : (
        <p>No previous orders.</p>
      )}

      <Modal
        title="Proceed with Payment?"
        visible={isModalVisible}
        onOk={handlePaymentProceed}
        onCancel={handleModalClose}
      >
        <Select
          onChange={(value) => setPaymentMethod(value)}
          value={paymentMethod}
          style={{ width: "50%" }}
        >
          <Select.Option value="COD">Cash on Delivery</Select.Option>
          <Select.Option value="Online">Online Payment</Select.Option>
        </Select>
      </Modal>

      <Modal
        title="Update Order"
        visible={isUpdateModalVisible}
        onOk={() => form.submit()}
        onCancel={handleUpdateModalClose}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateOrderSubmit}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="payment"
            label="Payment Method"
            rules={[
              { required: true, message: "Please select a payment method!" },
            ]}
          >
            <Select>
              <Select.Option value="COD">Cash on Delivery</Select.Option>
              <Select.Option value="Online">Online Payment</Select.Option>
            </Select>
          </Form.Item> */}
          {/* Add more form fields as needed */}
        </Form>
      </Modal>
    </div>
  );
};

export default UserHistory;
