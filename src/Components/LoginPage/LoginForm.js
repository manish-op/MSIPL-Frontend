import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { message, Card, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import LoginApiCall from "../API/User/LoginPageApi/LoginApiCall";
import logo from "../../images/images.png";
import "./LoginForm.css";

const { Title, Text } = Typography;

function LoginForm() {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) navigate("/dashboard/profile");
  }, [navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!loginDetails.email.trim() || !loginDetails.password.trim()) {
      message.error("Email and password cannot be blank.", 2);
      return;
    }

    try {
      await LoginApiCall(loginDetails, navigate);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <>
      <title>Login Page</title>
      <Header />
      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <img src={logo} alt="Company Logo" className="login-logo" />
            <Title level={3} style={{ margin: "10px 0 0 0" , color:"var(--text-color)" }}>
              Motorola Solutions India Pvt. Ltd.
            </Title>
            <Text type="secondary"   style={{color:"var(--text-color)" }}>Warehouse Management System</Text>
          </div>

          <form onSubmit={handleFormSubmit} className="login-form">
            <Input
              size="large"
              placeholder="Email"
              prefix={<UserOutlined />}
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
              style={{ marginBottom: "15px" }}
            />

            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined />}
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
              style={{ marginBottom: "20px" }}
            />

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="login-btn"
            >
              Login
            </Button>
          </form>

          <div className="back-home">
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
}

export default LoginForm;
