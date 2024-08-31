/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Input,
  Button,
  Table,
  ConfigProvider,
  Popconfirm,
  Modal,
  Form,
  Input as AntdInput,
  Checkbox,
  Space,
  Switch,
  Select,
  Typography,
} from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../../redux/features/orders/ordersApi";

const { Option } = Select;
const { Text } = Typography;

const Orders = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(false); // Track Confirm Order switch

  // Fetch orders query
  const { data: ordersData, isLoading } = useGetOrdersQuery(undefined);

  // Update and Delete mutation hooks
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId).unwrap();
      ("Order deleted successfully!");
    } catch (error) {
      console.error("Failed to delete order: ", error);
    }
  };

  const handleUpdate = async (values: any) => {
    const formattedValues = {
      userId: selectedOrder?.userId,
      products: values.products,
      address: values.address,
      payment: {
        method: selectedOrder?.payment?.method || "COD", // Assuming 'method' is fixed
        status: values.paymentStatus,
        price: Number(values.price),
      },
      order: {
        status: values.orderStatus,
        delivery: values.delivery,
        adminApproval: values.adminApproval || false,
        checkoutStatus: values.checkoutStatus || false,
      },
      isDeleted: values.isDeleted || false,
    };

    try {
      await updateOrder({
        id: selectedOrder?._id,
        body: formattedValues,
      }).unwrap();
      ("Order updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update order: ", error);
    }

    setIsModalOpen(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredOrders = ordersData?.data
    .filter((order: any) => {
      const productMatch = order.products.some((product: any) =>
        product.productId
          .toLowerCase()
          .includes(searchText?.toLowerCase() || ""),
      );

      const matchesSearchText =
        order.userDetails.name
          .toLowerCase()
          .includes(searchText?.toLowerCase() || "") ||
        order.userDetails.email
          .toLowerCase()
          .includes(searchText?.toLowerCase() || "") ||
        productMatch;

      const matchesConfirmedStatus =
        !showConfirmedOnly || order.order.status === "confirm";

      return matchesSearchText && matchesConfirmedStatus;
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ); // Sorting from New to Old;

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    form.setFieldsValue({
      ...order,
      paymentStatus: order?.payment?.status,
      price: order?.payment?.price,
      orderStatus: order?.order?.status,
      delivery: order?.order?.delivery,
      adminApproval: order?.order?.adminApproval,
      checkoutStatus: order?.order?.checkoutStatus,
      isDeleted: order?.isDeleted,
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...selectedOrder.products];
    updatedProducts.splice(index, 1);
    setSelectedOrder({ ...selectedOrder, products: updatedProducts });
    form.setFieldsValue({ products: updatedProducts });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "User Name",
      dataIndex: ["userDetails", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["userDetails", "email"],
      key: "email",
    },
    {
      title: "Contact No",
      dataIndex: ["userDetails", "contactNo"],
      key: "contactNo",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Products",
      key: "products",
      render: (_text: any, record: any) => (
        <ul>
          {record.products.map((product: any) => (
            <li key={product._id}>
              ID: {product.productId}, Quantity: {product.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Price",
      dataIndex: ["payment", "price"],
      key: "price",
    },
    {
      title: "Payment Status",
      dataIndex: ["payment", "status"],
      key: "paymentStatus",
      render: (status: string) => (status === "unpaid" ? "Unpaid" : "Paid"),
    },
    {
      title: "Order Status",
      dataIndex: ["order", "status"],
      key: "orderStatus",
    },
    {
      title: "Delivery",
      dataIndex: ["order", "delivery"],
      key: "delivery",
      render: (delivery: boolean) => (delivery ? "Delivered" : "Pending"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: { _id: string }) => (
        <div>
          <Button
            icon={<EyeOutlined />}
            style={{ marginRight: "8px" }}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this order?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1>Orders</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search orders..."
          value={searchText || ""}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: "25vw",
            marginRight: "8px",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
          }}
        />
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultBg: "#628753",
                defaultColor: "#fff",
                defaultHoverColor: "#deb306",
              },
            },
          }}
        >
          <Button
            onClick={() => "Search button clicked"}
            style={{
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <SearchOutlined />
          </Button>
        </ConfigProvider>
      </div>

      {/* Switch for Confirm Order */}
      <div style={{ marginBottom: "20px" }}>
        <span style={{ marginRight: "16px" }}>Confirm Order:</span>
        <Switch
          checked={showConfirmedOnly}
          onChange={(checked) => setShowConfirmedOnly(checked)}
        />
      </div>

      {/* Orders Table */}
      <Table
        dataSource={filteredOrders || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        style={{
          maxHeight: "65vh",
          overflow: "auto",
        }}
      />

      {/* Update Order Modal */}
      <Modal
        title="Update Order"
        visible={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          id="order-update-form"
          initialValues={selectedOrder}
          form={form}
          onFinish={handleUpdate}
        >
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>User ID</span>}
            name="userId"
          >
            {/* <AntdInput disabled /> */}
            <Text>{selectedOrder?.userId}</Text>
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>User Name</span>}
          >
            <Text>{selectedOrder?.userDetails?.name}</Text>
          </Form.Item>
          <Form.Item label={<span style={{ fontWeight: "bold" }}>Email</span>}>
            <Text>{selectedOrder?.userDetails?.email}</Text>
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Contact No</span>}
          >
            <Text>{selectedOrder?.userDetails?.contactNo}</Text>
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Address</span>}
          >
            <Text>{selectedOrder?.address}</Text>
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Price</span>}
            name="price"
          >
            <Text>{selectedOrder?.payment?.price}</Text>
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Payment Method</span>}
            name="payment method"
          >
            <Text>{selectedOrder?.payment?.method}</Text>
          </Form.Item>
          <Form.Item label="Payment Status" name="paymentStatus">
            <Select>
              <Option value="paid">Paid</Option>
              <Option value="unpaid">Unpaid</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Order Status" name="orderStatus">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="confirm">Confirm</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Delivery" name="delivery" valuePropName="checked">
            <Checkbox />
          </Form.Item>

          {/* Products Field as List */}
          <Form.List name="products">
            {(fields) => (
              <>
                {fields.map((field, index) => (
               
                    <Space key={`${field.key}-${index}`} align="baseline">
                      <Form.Item
                        {...field}
                        key={`product-id-${index}`} // Explicitly define a unique key
                        label="Product ID"
                        name={[field.name, "productId"]}
                      >
                        <AntdInput disabled />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        key={`quantity-${index}`} // Explicitly define a unique key
                        label="Quantity"
                        name={[field.name, "quantity"]}
                      >
                        <AntdInput disabled />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        onClick={() => removeProduct(index)}
                      >
                        Delete
                      </Button>
                    </Space>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item
            label="Admin Approval"
            name="adminApproval"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Checkout Status"
            name="checkoutStatus"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Is Deleted"
            name="isDeleted"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Orders;
