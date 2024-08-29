import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Space,
  Card,
  Checkbox,
  Row,
  Col,
  notification,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { TProduct } from "../../types/productTypes";
import { useAddProductMutation } from "../../redux/features/products/productsApi";

const CreateProduct = () => {
  const [form] = Form.useForm();
  const [uploadOption, setUploadOption] = useState<"file" | "url">("url"); // State to toggle between file upload and URL input
  const [addProduct] = useAddProductMutation(); // Hook to add a product

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

  const onFinish = async (values: TProduct) => {
    try {
      await addProduct(values).unwrap();
      openNotification(
        "success",
        "Product Added",
        "The product has been added successfully!",
      );
      form.resetFields();
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

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "3vh" }}>
        ADD A NEW PRODUCT
      </h1>
      <Form
        form={form}
        layout="vertical"
        name="create_product"
        onFinish={onFinish}
        style={{ maxWidth: 800, margin: "0 auto" }}
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
              <Select
                value={uploadOption}
                onChange={(value) => setUploadOption(value)}
                style={{ marginBottom: 16 }}
              >
                <Select.Option value="url">Upload by URL</Select.Option>
                <Select.Option value="file">Upload File</Select.Option>
              </Select>

              {uploadOption === "url" ? (
                <Form.Item
                  name="image"
                  rules={[
                    { required: true, message: "Please enter an image URL" },
                  ]}
                >
                  <Input placeholder="Enter image URL" />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="image"
                    rules={[
                      { required: true, message: "Please enter an image URL" },
                    ]}
                  >
                    <Input placeholder="Enter image URL" />
                  </Form.Item>
                  {/* <Form.Item
                  name="imageFile"
                  rules={[{ required: true, message: "Please upload an image" }]}
                >
                  <Upload beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item> */}
                </>
              )}
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
                        key={field.key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name]}
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProduct;
