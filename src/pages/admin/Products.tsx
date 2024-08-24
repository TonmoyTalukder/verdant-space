import React, { useState } from "react";
import { Input, Select, Button, Table, ConfigProvider, Popconfirm} from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSearchProductsQuery, useGetProductsQuery } from "../../redux/features/products/productsApi";

const { Option } = Select;

const Products = () => {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // If searchText and selectedOption are both empty, fetch all products
  const { data: searchResults, isLoading: isSearchLoading } = useSearchProductsQuery(
    { searchTerm: searchText, type: selectedOption },
    {
      skip: !searchText && !selectedOption, // Skip search if both searchText and selectedOption are null
    }
  );

  // Fetch all products when no search or filter is applied
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery(
    undefined,
    {
      skip: !!searchText || !!selectedOption, // Skip fetching all products if search or filter is applied
    }
  );

  const isLoading = isSearchLoading || isProductsLoading;
  const dataSource = searchText || selectedOption ? searchResults?.data : productsData?.data;

  // const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = () => { // async (productId: string)
    // try {
    //   await deleteProduct(productId).unwrap();
    //   notification.success({ message: 'Product deleted successfully!' });
    // } catch (error) {
    //   notification.error({ message: 'Failed to delete product' });
    // }
    console.log("delete product");
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "On Sale",
      dataIndex: ["sale", "onSale"],
      key: "onSale",
      render: (onSale: string) => (onSale === "yes" ? "Yes" : "No"),
    },
    {
      title: "Discount (%)",
      dataIndex: ["sale", "onSaleDiscountPercentage"],
      key: "discount",
    },
    {
      title: "Inventory",
      dataIndex: ["inventory", "quantity"],
      key: "quantity",
    },
    {
      title: "Actions",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: { productId: string; }) => (
        <div>
          <Button
            icon={<EyeOutlined />}
            style={{ marginRight: "8px" }}
            onClick={() => window.alert(`Viewing ${record.productId}`)} // Replace with view logic
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete()}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Search Tab */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          marginLeft: "2%",
          marginRight: "2%",
          position: "relative",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search..."
          value={searchText || ""}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "25vw",
            marginRight: "8px",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
          }}
        />
        <Select
          placeholder="Category"
          onChange={(value) =>
            setSelectedOption(value === "All" ? null : value)
          }
          style={{
            width: "12vw",
            marginRight: "8px",
          }}
          defaultValue="All"
        >
          <Option value="All">All Categories</Option>
          <Option value="Fruit">Fruit</Option>
          <Option value="Flower">Flower</Option>
          <Option value="Home Decor Plant">Home Decor Plant</Option>
          <Option value="Wood Plant">Wood Plant</Option>
          <Option value="Herb">Herb</Option>
        </Select>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultBg: "#21390e",
                defaultHoverColor: "#deb306",
              },
            },
          }}
        >
          <Button
            onClick={() => {
              // Trigger search logic here if necessary
            }}
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

      {/* Table */}
      <Table
        dataSource={dataSource || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
      />
    </>
  );
};

export default Products;
