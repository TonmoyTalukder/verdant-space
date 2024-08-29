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
  Switch,
} from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/features/users/users.Api";

const CreateAdmin = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAdmins, setShowAdmins] = useState(true); // Track Admin switch
  const [showUsers, setShowUsers] = useState(true); // Track User switch

  // Fetch users query
  const { data: usersData, isLoading } = useGetUsersQuery(undefined);

  // Update and Delete mutation hooks
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleDelete = async (userId: string) => {

    try {
      await deleteUser({ id: userId }).unwrap();
      ("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user: ", error);
    }
  };

  const handleUpdate = async (values: any) => {
    const formattedValues = {
      id: selectedUser?._id,
      name: values.name,
      email: values.email,
      contactNo: values.contactNo,
      isAdmin: values.isAdmin || false,
    };

    try {
      await updateUser(formattedValues).unwrap();
      ("User updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update user: ", error);
    }

    setIsModalOpen(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleAdminToggle = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUser({
        id: userId,
        isAdmin,
      }).unwrap();
      ("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user: ", error);
    }
  };

  // Filter users based on search text and switch states
  const filteredUsers = usersData?.data.filter((user: any) => {
    const matchSearchText =
      user.name.toLowerCase().includes(searchText?.toLowerCase() || "") ||
      user.email.toLowerCase().includes(searchText?.toLowerCase() || "");

    const matchAdminSwitch = showAdmins && user.isAdmin;
    const matchUserSwitch = showUsers && !user.isAdmin;

    return (
      matchSearchText &&
      ((showAdmins && showUsers) || matchAdminSwitch || matchUserSwitch)
    );
  });

  const openModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      isAdmin: user.isAdmin,
    });
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean, record: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={isAdmin}
            onChange={(e) => handleAdminToggle(record._id, e.target.checked)}
          />
          <span style={{ marginLeft: "8px" }}>{isAdmin ? "Yes" : "No"}</span>
        </div>
      ),
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
            title="Are you sure to delete this user?"
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
      <h1>Users</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search users..."
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

      {/* Switches for Admin and User */}
      <div style={{ marginBottom: "20px" }}>
        <span style={{ marginRight: "16px" }}>Admin:</span>
        <Switch
          checked={showAdmins}
          onChange={(checked) => setShowAdmins(checked)}
        />
        <span style={{ marginRight: "16px", marginLeft: "16px" }}>User:</span>
        <Switch
          checked={showUsers}
          onChange={(checked) => setShowUsers(checked)}
        />
      </div>

      {/* Users Table */}
      <Table
        dataSource={filteredUsers || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
      />

      {/* Update User Modal */}
      <Modal
        title="Update User"
        visible={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form id="user-update-form" form={form} onFinish={handleUpdate}>
          <Form.Item label="Name" name="name">
            <AntdInput />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <AntdInput />
          </Form.Item>
          <Form.Item label="Contact No" name="contactNo">
            <AntdInput />
          </Form.Item>
          <Form.Item label="Admin" name="isAdmin" valuePropName="checked">
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

export default CreateAdmin;
