import { useState, useEffect } from "react";
import { Button, Input, Typography, Form, Space, Card, Row, Col } from "antd";
import { EditOutlined, SaveOutlined, EyeOutlined, EyeInvisibleOutlined, UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useGetSingleUserQuery, useUpdateUserMutation } from "../../redux/features/users/users.Api";
import { RootState } from "../../redux/store";
import { ImProfile } from "react-icons/im";

const { Text } = Typography;

const UserProfile = () => {
  const email = useSelector((state: RootState) => state.auth.email);
  const { data: userDetails, refetch } = useGetSingleUserQuery(email || "");
  const [updateUser] = useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const user = userDetails?.data;

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [form, user]);

  const handleEdit = (field: string) => {
    setEditField(field);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const updatedValues = form.getFieldsValue();
      await updateUser({ id: user._id, ...updatedValues }).unwrap();
      refetch();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        title={<h1 style={{ textAlign: "center" }}><ImProfile /></h1>}
        style={{ borderRadius: "8px", padding: '2vh 2vw' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span style={{ fontWeight: 'bold' }}><UserOutlined /> Name</span>} name="name">
                {isEditing && editField === "name" ? (
                  <Input defaultValue={user?.name} />
                ) : (
                  <Text>{user?.name}</Text>
                )}
                {!isEditing && (
                  <Button
                    icon={<EditOutlined />}
                    type="link"
                    onClick={() => handleEdit("name")}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={{ fontWeight: 'bold' }}><MailOutlined /> Email</span>} name="email">
                <Text>{user?.email}</Text>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={{ fontWeight: 'bold' }}><PhoneOutlined /> Contact No</span>} name="contactNo">
                {isEditing && editField === "contactNo" ? (
                  <Input defaultValue={user?.contactNo} />
                ) : (
                  <Text>{user?.contactNo}</Text>
                )}
                {!isEditing && (
                  <Button
                    icon={<EditOutlined />}
                    type="link"
                    onClick={() => handleEdit("contactNo")}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={{ fontWeight: 'bold' }}><HomeOutlined /> Address</span>} name="address">
                {isEditing && editField === "address" ? (
                  <Input defaultValue={user?.address} />
                ) : (
                  <Text>{user?.address}</Text>
                )}
                {!isEditing && (
                  <Button
                    icon={<EditOutlined />}
                    type="link"
                    onClick={() => handleEdit("address")}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={{ fontWeight: 'bold' }}><LockOutlined /> Password</span>} name="password">
                {isEditing && editField === "password" ? (
                  <Input.Password
                    defaultValue={user?.password}
                    visibilityToggle={false}
                    iconRender={(visible) =>
                      visible ? <EyeOutlined onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                    }
                    type={passwordVisible ? "text" : "password"}
                  />
                ) : (
                  <Text>******</Text>
                )}
                {!isEditing && (
                  <Button
                    icon={<EditOutlined />}
                    type="link"
                    onClick={() => handleEdit("password")}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          {isEditing && (
            <Space style={{ marginTop: "20px" }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                Save
              </Button>
              <Button type="default" onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default UserProfile;
