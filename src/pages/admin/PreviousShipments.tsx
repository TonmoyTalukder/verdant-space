/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Table, ConfigProvider, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useGetOrdersQuery } from "../../redux/features/orders/ordersApi";

const PreviousShipments = () => {
  const [searchText, setSearchText] = useState<string | null>(null);

  // Fetch orders data
  const { data: ordersData, isLoading } = useGetOrdersQuery(undefined);

  // Filter orders with Delivery status true
  const filteredOrders = ordersData?.data.filter(
    (order: any) =>
      order.order.delivery === true &&
      (order.userDetails.name
        .toLowerCase()
        .includes(searchText?.toLowerCase() || "") ||
        order.userDetails.email
          .toLowerCase()
          .includes(searchText?.toLowerCase() || "")),
  );

  // Handle search
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // Define columns for the table
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
  ];

  return (
    <div>
      <h1>Previous Shipments</h1>
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

      {/* Previous Shipments Table */}
      <Table
        dataSource={filteredOrders || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
      />
    </div>
  );
};

export default PreviousShipments;
