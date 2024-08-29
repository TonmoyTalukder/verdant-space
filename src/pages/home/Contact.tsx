/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input, Button, notification, Card } from "antd";

// Custom styles
const containerStyle: React.CSSProperties = {
  backgroundColor: "#cfe8cc", // Page theme color
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
  marginTop: "5px", // Margin Top
  marginBottom: "5px", // Margin Bottom
};

const formStyle: React.CSSProperties = {
  maxWidth: "100%",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#21390e", // Button color
  borderColor: "#21390e", // Button border color
};

const Contact: React.FC = () => {
  const [form] = Form.useForm();

  // Handle form submission
  const onFinish = (values: any) => {
    console.log("Form values:", values);

    // Display success notification
    notification.success({
      message: "Your Message Successfully Submitted",
      description: "Thank you for getting in touch!",
    });

    // Reset the form fields after submission
    form.resetFields();
  };

  return (
    <div style={containerStyle}>
      <Card title="Contact Us" bordered={false} style={cardStyle}>
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
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please input the subject!" }]}
          >
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input your message!" }]}
          >
            <Input.TextArea placeholder="Enter your message" rows={4} />
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

export default Contact;
