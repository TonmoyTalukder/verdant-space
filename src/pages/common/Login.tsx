 
import React, { useState } from "react";
import { Row, Col, Form, Input, Button, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import VerdantSpaceBanner from "/VerdantSpace Banner.png"; // Assuming you are importing the image
import { useGetSingleUserQuery } from "../../redux/features/users/users.Api";
import { useDispatch } from "react-redux";
import { setUserRole } from "../../redux/features/users/authSlice";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow for elegance */
  @media (max-width: 576px) {
    margin-top: 16px; /* Adding margin for smaller screens */
  }
`;

const LoginTitle = styled.h2`
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
    margin-top: 1%;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  border-radius: 8px;
  max-height: 250px;
  object-fit: contain;

  @media (max-width: 767px) {
    width: 40vw;
    margin-top: 25vh;
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
    height: 50vh;
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
  }
`;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isFetching } = useGetSingleUserQuery(email, {
    skip: !email, // Skip the query if email is empty
  });

  // (user);

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

  const handleLogin = async () => {
    // values: any
    // ("Login values:", values);

    if (isFetching) return;

    try {
      // (user.data.password);
      // ("user.password: ", user.password)
      // ("password: ", password)
      if (user && user.data.password === password) {
        openNotification(
          "success",
          "Log in Successful!!",
          "You have been logged in successfully!",
        );
        form.resetFields();
        // Dispatch the userRole to the Redux store
        const role = user.data.isAdmin ? "admin" : "user";
        dispatch(setUserRole({ role, email: user.data.email }));
        navigate(role === "admin" ? "/admin" : "/user");
      } else {
        openNotification(
          "error",
          "Log in Failed!",
          "Invalid email or password.",
        );
      }
    } catch (error) {
      // Type narrowing for unknown error
      if (error instanceof Error) {
        openNotification(
          "error",
          "Error on logging in.",
          `Error: ${error.message}`,
        );
      } else {
        openNotification(
          "error",
          "Error on logging in.",
          "An unknown error occurred",
        );
      }
    }
  };

  return (
    <LoginContainer style={{ backgroundColor: "#fff", overflow: "hidden" }}>
      <Row
        gutter={[32, 32]}
        justify="center"
        style={{ height: "100vh", width: "100%", alignContent: "center" }}
      >
        <Column1Styles xs={24} sm={12}>
          <StyledImage src={VerdantSpaceBanner} alt="Verdant Space" />
          <VerdantText>Verdant-Space</VerdantText>
        </Column1Styles>

        <Column2Styles xs={24} sm={12}>
          <LoginBox>
            <LoginTitle>Please Log In</LoginTitle>
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <StyledInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <StyledInputPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <StyledButton htmlType="submit">Log In</StyledButton>
            </Form>
            <RegisterText>
              New User? <Link to="/register">Register yourself first</Link>
            </RegisterText>
          </LoginBox>
        </Column2Styles>
      </Row>
    </LoginContainer>
  );
};

export default Login;
