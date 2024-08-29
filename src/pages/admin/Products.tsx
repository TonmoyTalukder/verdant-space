/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Input,
  Select,
  Button,
  Table,
  ConfigProvider,
  Popconfirm,
  Modal,
  Form,
  notification,
  InputNumber,
  Row,
  Col,
  Space,
  Card,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useSearchProductsQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductMutation,
} from "../../redux/features/products/productsApi";
import { TProduct } from "../../types/productTypes";

const { Option } = Select;

const Products = () => {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [currentProduct, setCurrentProduct] = useState<TProduct | null>(null); // State to hold the current product data
  const [form] = Form.useForm();

  const [updateProduct] = useUpdateProductMutation(); // Hook for updating product
  const [deleteProduct] = useDeleteProductMutation();

  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchProductsQuery(
      { searchTerm: searchText, type: selectedOption },
      { skip: !searchText && !selectedOption },
    );

  const [addProduct] = useAddProductMutation(); // Hook to add a product

  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery(undefined, { skip: !!searchText || !!selectedOption });

  const isLoading = isSearchLoading || isProductsLoading;
  const dataSource =
    searchText || selectedOption ? searchResults?.data : productsData?.data;

  const handleEdit = (product: TProduct) => {
    setCurrentProduct(product); // Set the current product with all its properties, including productId
    form.setFieldsValue({
      ...product,
      placeholderImages: product.placeholderImages || [], // Ensure this is an array
    });
    setIsModalVisible(true); // Open the modal
  };

  const openNotification = (
    type: "success" | "error",
    message: string,
    description: string,
  ) => {
    notification[type]({
      message: message,
      description: description,
      placement: "bottomLeft",
    });
  };

  const handleAddProduct = async (values: TProduct) => {
    if (!Array.isArray(values.placeholderImages)) {
      values.placeholderImages = [];
    }

    try {
      await addProduct(values).unwrap();
      openNotification(
        "success",
        "Product Added",
        "The product has been added successfully!",
      );
      form.resetFields();
      setIsAddProductModalVisible(false);
    } catch (error) {
      // Type narrowing for unknown error
      if (error instanceof Error) {
        openNotification(
          "error",
          "Error Adding Product",
          `Error: ${error.message}`,
        );
      } else {
        openNotification(
          "error",
          "Error Adding Product",
          "An unknown error occurred",
        );
      }
    }
  };

  const handleUpdate = async (values: TProduct) => {
    if (!Array.isArray(values.placeholderImages)) {
      values.placeholderImages = [];
    }

    if (!currentProduct || !currentProduct.productId) {
      notification.error({ message: "Product ID is missing, update failed" });
      return;
    }

    // Ensure the onSaleDiscountPercentage is handled correctly
    const updatedProduct = {
      ...currentProduct,
      ...values,
      productId: currentProduct.productId, // Ensure productId is included
    };

    try {
      await updateProduct(updatedProduct).unwrap();
      // Update the state or refresh data if needed here

      notification.success({ message: "Product updated successfully!" });
      setIsModalVisible(false);
    } catch (error) {
      if (error instanceof Error) {
        notification.error({ message: `Update failed: ${error.message}` });
      } else {
        notification.error({ message: "Update failed due to unknown error" });
      }
    }
  };

  const handleDelete = async (product: TProduct) => {
    try {
      await deleteProduct({ productId: product.productId }).unwrap(); // Call mutation with product ID
      notification.success({ message: "Product deleted successfully!" });
    } catch (error) {
      if (error instanceof Error) {
        notification.error({
          message: `Delete failed: ${error.message}`,
        });
      } else {
        notification.error({
          message: "Delete failed due to an unknown error",
        });
      }
    }
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Image",
      dataIndex: "image", // Adjust this to match the field containing the image URL
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Product"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            border: "1px solid #d1ad0d",
            borderRadius: "5px",
          }} // Ensures image fits within 50x50 box
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
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
      render: (_: any, record: TProduct) => (
        <div>
          <Button
            icon={<EyeOutlined />}
            style={{ marginRight: "8px" }}
            onClick={() => handleEdit(record)} // Handle edit and open modal
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record)} // Call the delete handler
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
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
          style={{ width: "12vw", marginRight: "8px" }}
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
                defaultBg: "#628753",
                defaultColor: "#fff",
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

          <Button
            onClick={() => setIsAddProductModalVisible(true)}
            style={{
              margin: "0 2vw",
            }}
          >
            + Add Product
          </Button>
        </ConfigProvider>
      </div>

      <Table
        dataSource={dataSource || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        style={{ maxHeight: "80vh" }}
      />

      <Modal
        title="Add Product"
        visible={isAddProductModalVisible}
        onCancel={() => setIsAddProductModalVisible(false)}
        footer={null}
        style={{ height: "100px" }}
      >
        <Form
          form={form}
          layout="vertical"
          name="create_product"
          onFinish={handleAddProduct}
          style={{
            maxWidth: "800vw",
            margin: "0 auto",
            maxHeight: "70vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {/* Name */}
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the product name" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              {/* Price */}
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              {/* Description */}
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter the description" },
                ]}
              >
                <Input.TextArea placeholder="Enter product description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {/* Image Upload Options */}
              <Form.Item label="Product Image">
                <Form.Item
                  name="image"
                  rules={[
                    { required: true, message: "Please enter an image URL" },
                  ]}
                >
                  <Input placeholder="Enter image URL" />
                </Form.Item>
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              {/* Type */}
              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please select the type" }]}
              >
                <Select placeholder="Select a type">
                  <Select.Option value="Fruits">Fruits</Select.Option>
                  <Select.Option value="Flower">Flower</Select.Option>
                  <Select.Option value="Home Decor Plant">
                    Home Decor Plant
                  </Select.Option>
                  <Select.Option value="Wood Plant">Wood Plant</Select.Option>
                  <Select.Option value="Herb">Herb</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Placeholder Images */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Placeholder Images">
                <Form.List name="placeholderImages">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key} // Key passed directly here
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name]}
                            key={field.key} // Ensure key is passed directly
                            rules={[
                              {
                                required: true,
                                message: "Please add an image URL",
                              },
                            ]}
                          >
                            <Input placeholder="Image URL" />
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Image
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>

          {/* Seasonal and Rating */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Seasonal"
                name="seasonal"
                rules={[
                  { required: true, message: "Select season of the product" },
                ]}
              >
                <Select placeholder="Select season of the product">
                  <Select.Option value="Summer">Summer</Select.Option>
                  <Select.Option value="Winter">Winter</Select.Option>
                  <Select.Option value="Spring">Spring</Select.Option>
                  <Select.Option value="Fall">Fall</Select.Option>
                  <Select.Option value="All Seasons">All Seasons</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: "Please provide a rating" }]}
              >
                <InputNumber min={0} max={5} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Sale Details */}
          <Card title="Sale Details" style={{ marginBottom: 20 }}>
            <Form.Item
              label="On Sale"
              name={["sale", "onSale"]}
              rules={[
                {
                  required: true,
                  message: "Please select if the product is on sale",
                },
              ]}
            >
              <Select placeholder="Select if on sale">
                <Select.Option value="yes">Yes</Select.Option>
                <Select.Option value="no">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Discount Percentage"
              name={["sale", "onSaleDiscountPercentage"]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
          </Card>

          {/* Inventory */}
          <Card title="Inventory" style={{ marginBottom: 20 }}>
            <Form.Item
              label="Quantity"
              name={["inventory", "quantity"]}
              rules={[{ required: true, message: "Please enter the quantity" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="In Stock"
              name={["inventory", "inStock"]}
              valuePropName="checked"
            >
              <Checkbox>In Stock</Checkbox>
            </Form.Item>
          </Card>

          {/* Ordered Quantity */}
          <Form.Item
            label="Ordered Quantity"
            name="orderedQuantity"
            rules={[
              { required: false, message: "Please enter the ordered quantity" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* Tags */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Tags">
                <Form.List name="tags">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key} // Key passed directly here
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name]}
                            key={field.key} // Ensure key is passed directly
                            rules={[
                              {
                                required: true,
                                message: "Please add a tag",
                              },
                            ]}
                          >
                            <Input placeholder="tag" />
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Tag
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              + Add Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ height: "100px" }}
      >
        <Form
          form={form}
          layout="vertical"
          name="create_product"
          onFinish={handleUpdate}
          style={{
            maxWidth: "800vw",
            margin: "0 auto",
            maxHeight: "70vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {/* Name */}
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the product name" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              {/* Price */}
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              {/* Description */}
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter the description" },
                ]}
              >
                <Input.TextArea placeholder="Enter product description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {/* Image Upload Options */}
              <Form.Item label="Product Image">
                <Form.Item
                  name="image"
                  rules={[
                    { required: true, message: "Please enter an image URL" },
                  ]}
                >
                  <Input placeholder="Enter image URL" />
                </Form.Item>
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              {/* Type */}
              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please select the type" }]}
              >
                <Select placeholder="Select a type">
                  <Select.Option value="Fruits">Fruits</Select.Option>
                  <Select.Option value="Flower">Flower</Select.Option>
                  <Select.Option value="Home Decor Plant">
                    Home Decor Plant
                  </Select.Option>
                  <Select.Option value="Wood Plant">Wood Plant</Select.Option>
                  <Select.Option value="Herb">Herb</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Placeholder Images */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Placeholder Images">
                <Form.List name="placeholderImages">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key} // Key passed directly here
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name]}
                            key={field.key} // Ensure key is passed directly
                            rules={[
                              {
                                required: true,
                                message: "Please add an image URL",
                              },
                            ]}
                          >
                            <Input placeholder="Image URL" />
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Image
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>

          {/* Seasonal and Rating */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Seasonal"
                name="seasonal"
                rules={[
                  { required: true, message: "Select season of the product" },
                ]}
              >
                <Select placeholder="Select season of the product">
                  <Select.Option value="Summer">Summer</Select.Option>
                  <Select.Option value="Winter">Winter</Select.Option>
                  <Select.Option value="Spring">Spring</Select.Option>
                  <Select.Option value="Fall">Fall</Select.Option>
                  <Select.Option value="All Seasons">All Seasons</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: "Please provide a rating" }]}
              >
                <InputNumber min={0} max={5} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Sale Details */}
          <Card title="Sale Details" style={{ marginBottom: 20 }}>
            <Form.Item
              label="On Sale"
              name={["sale", "onSale"]}
              rules={[
                {
                  required: true,
                  message: "Please select if the product is on sale",
                },
              ]}
            >
              <Select placeholder="Select if on sale">
                <Select.Option value="yes">Yes</Select.Option>
                <Select.Option value="no">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Discount Percentage"
              name={["sale", "onSaleDiscountPercentage"]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
          </Card>

          {/* Inventory */}
          <Card title="Inventory" style={{ marginBottom: 20 }}>
            <Form.Item
              label="Quantity"
              name={["inventory", "quantity"]}
              rules={[{ required: true, message: "Please enter the quantity" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="In Stock"
              name={["inventory", "inStock"]}
              valuePropName="checked"
            >
              <Checkbox>In Stock</Checkbox>
            </Form.Item>
          </Card>

          {/* Ordered Quantity */}
          <Form.Item
            label="Ordered Quantity"
            name="orderedQuantity"
            rules={[
              { required: false, message: "Please enter the ordered quantity" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* Tags */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Tags">
                <Form.List name="tags">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key} // Key passed directly here
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name]}
                            key={field.key} // Ensure key is passed directly
                            rules={[
                              {
                                required: true,
                                message: "Please add a tag",
                              },
                            ]}
                          >
                            <Input placeholder="tag" />
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Tag
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>

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

export default Products;
