/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input, Button, Upload, notification, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// Custom styles
const containerStyle: React.CSSProperties = {
  backgroundColor: "#eaf4e5", // Page theme color
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fffff3", // Card theme color
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  width: "100%",
  marginTop: "20px", // Margin Top
  marginBottom: "20px", // Margin Bottom
};

const formStyle: React.CSSProperties = {
  maxWidth: "100%",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#21390e", // Button color
  borderColor: "#21390e", // Button border color
};

const SupplyProducts: React.FC = () => {
  const [form] = Form.useForm();

  // Handle form submission
  const onFinish = (values: any) => {
    console.log("Form values:", values);

    // Display success notification
    notification.success({
      message: "Submission Successful",
      description: "Thank you for submitting your product details!",
    });

    // Reset the form fields after submission
    form.resetFields();
  };

  // Handle file upload change
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div style={containerStyle}>
      <Card title="Supply Product Form" bordered={false} style={cardStyle}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={formStyle}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input placeholder="Enter your address" />
          </Form.Item>

          <Form.Item
            label="Contact No"
            name="contact"
            rules={[
              { required: true, message: "Please input your contact number!" },
            ]}
          >
            <Input placeholder="Enter your contact number" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Product Details"
            name="productDetails"
            rules={[
              { required: true, message: "Please input the product details!" },
            ]}
          >
            <Input.TextArea placeholder="Enter product details" />
          </Form.Item>

          <Form.Item
            label="Product Image"
            name="productImage"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="productImage"
              listType="picture"
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Comment" name="comment">
            <Input.TextArea placeholder="Enter any additional comments" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={buttonStyle} block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SupplyProducts;
