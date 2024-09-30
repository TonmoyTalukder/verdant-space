/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Row, Col, Form, Input, Button, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import VerdantSpaceBanner from "/VerdantSpace Banner.png";
import { setUserRole } from "../../redux/features/users/authSlice";
import { useDispatch } from "react-redux";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../redux/features/users/users.Api";

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const RegisterBox = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow for elegance */
  @media (max-width: 767px) {
    max-height: 80vh;
    overflow-y: scroll;
  }
  @media (max-width: 576px) {
    margin-top: 16px; /* Adding margin for smaller screens */
  }
`;

const RegisterTitle = styled.h2`
  text-align: center;
  color: #628753;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StyledButton = styled(Button)`
  background-color: #628753 !important;
  color: white;
  width: 100%;
  &:hover {
    color: white !important;
    background-color: #d1ad0d !important;
    border-color: #d1ad0d !important;
  }
  &:focus {
    background-color: #d1ad0d !important;
    border-color: #d1ad0d !important;
  }
`;

const StyledInput = styled(Input)`
  &:hover {
    border-color: #d1ad0d !important;
  }
  &:focus {
    border-color: #d1ad0d !important;
    box-shadow: 0 0 0 2px rgba(209, 173, 13, 0.2) !important;
  }
`;

const StyledInputPassword = styled(Input.Password)`
  &:hover {
    border-color: #d1ad0d !important;
  }
  &:focus {
    border-color: #d1ad0d !important;
    box-shadow: 0 0 0 2px rgba(209, 173, 13, 0.2) !important;
  }
`;

const RegisterText = styled.div`
  text-align: center;
  margin-top: 16px;
  color: #555;
  a {
    color: #628753;
    &:hover {
      color: #d1ad0d;
      text-decoration: underline;
    }
  }
`;

const VerdantText = styled.h3`
  text-align: center;
  color: #fff;
  margin-top: 5%;
  font-size: 32px;
  @media (max-width: 767px) {
    font-size: 20px;
    margin-top: 4%;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  border-radius: 8px;
  max-height: 250px;
  object-fit: contain;

  @media (max-width: 767px) {
    width: 40vw;
    margin-top: 20vh;
    height: 100px; /* Smaller image height for small screens */
  }
`;

const Column1Styles = styled(Col)`
  background-color: #628753;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 767px) {
    margin-top: 10%;
    height: 50%;
    width: 100vw;
    justify-content: center;
    align-items: center;
  }
`;

const Column2Styles = styled(Col)`
  background-color: white;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 767px) {
    align-items: flex-start;
    // overflow-y: scroll;
    // margin-bottom: 20vh;
  }
`;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [emailExists, setEmailExists] = useState(false);
  const [contactExists, setContactExists] = useState(false);
  const [addUser] = useAddUserMutation();
  const { data: userData } = useGetUsersQuery(undefined);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const checkEmailExists = (email: string) => {
    if (userData && userData.data.some((user: any) => user.email === email)) {
      setEmailExists(true);
      openNotification("error", "Registration Error", "Email already exists");
    } else {
      setEmailExists(false);
    }
  };

  const checkContactExists = (contactNo: string) => {
    if (
      userData &&
      userData.data.some((user: any) => user.contactNo === contactNo)
    ) {
      setContactExists(true);
      openNotification(
        "error",
        "Registration Error",
        "Contact number already exists",
      );
    } else {
      setContactExists(false);
    }
  };

  const handleRegister = async (values: any) => {
    if (emailExists || contactExists) {
      openNotification(
        "error",
        "Registration Error",
        "Email or contact number already exists",
      );
      return;
    }

    const userRegData = {
      ...values,
      isAdmin: false,
      isDelete: false,
    };

    try {
      await addUser(userRegData).unwrap();
      openNotification(
        "success",
        "Registration Successful",
        "Your account has been created successfully.",
      );
      form.resetFields();
      dispatch(setUserRole({ role: "user", email: userRegData.email }));
      navigate("/user");
    } catch (error: any) {
      console.log("error ===> ", error);
      // Type narrowing for unknown error
      if (error instanceof Error) {
        const errorMessage =
          (error as any)?.response?.data?.message || error.message;
        openNotification(
          "error",
          "Error on Registering.",
          `Error: ${errorMessage}`,
        );
      } else {
        openNotification(
          "error",
          "Error on Registering.",
          `${error.data.message}`,
        );
      }
      console.log("error => ", error);
    }
  };

  return (
    <RegisterContainer style={{ backgroundColor: "#fff" }}>
      {/* overflowY: "scroll" */}
      <Row
        gutter={[32, 32]}
        justify="center"
        style={{ height: "100vh", width: "100%", alignContent: "center" }}
      >
        <Column1Styles xs={24} sm={24} md={12}>
          <StyledImage src={VerdantSpaceBanner} alt="Verdant Space" />
          <VerdantText>Verdant-Space</VerdantText>
        </Column1Styles>

        <Column2Styles xs={24} sm={24} md={12}>
          <RegisterBox>
            <RegisterTitle>Create Your Account</RegisterTitle>
            <Form form={form} layout="vertical" onFinish={handleRegister}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <StyledInput />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <StyledInput onBlur={(e) => checkEmailExists(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <StyledInputPassword />
              </Form.Item>

              <Form.Item
                label="Contact Number"
                name="contactNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter your contact number",
                  },
                ]}
              >
                <StyledInput
                  onBlur={(e) => checkContactExists(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <StyledInput />
              </Form.Item>

              <StyledButton htmlType="submit">Register</StyledButton>
            </Form>
            <RegisterText>
              Already have an account? <Link to="/login">Log In here</Link>
            </RegisterText>
          </RegisterBox>
        </Column2Styles>
      </Row>
    </RegisterContainer>
  );
};

export default Register;
