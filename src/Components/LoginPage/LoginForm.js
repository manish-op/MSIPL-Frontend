// LoginForm.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  message,
  Card,
  Input,
  Button,
  Typography,
  Radio,
  Space,
} from "antd";
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
  const [service, setService] = useState("warehouse"); // default pre-selected
  const [loading, setLoading] = useState(false);

  const radioWrapperRef = useRef(null);

  useEffect(() => {
    // prefill previously selected service only
    const savedService = localStorage.getItem("msipl_selected_service");
    if (savedService === "warehouse" || savedService === "rma") setService(savedService);

    // focus first radio input for keyboard users when component mounts
    setTimeout(() => {
      if (radioWrapperRef.current) {
        const firstInput = radioWrapperRef.current.querySelector('input[type="radio"]');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  }, []);

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const email = (loginDetails.email || "").trim();
    const pwd = (loginDetails.password || "").trim();

    if (!email || !pwd) {
      message.error("Email and password cannot be blank.", 2);
      return;
    }
    if (!validateEmail(email)) {
      message.error("Please enter a valid email address.", 2);
      return;
    }

    try {
      setLoading(true);

      // persist selected service for next time
      localStorage.setItem("msipl_selected_service", service);

      // call login API with service included
      const payload = { email, password: pwd, service }; // backend can consume "service"
      const result = await LoginApiCall(payload);

      if (result && result.success) {
        // on success navigate directly to selected service area
        if (service === "rma") navigate("/rma");
        else navigate("/dashboard/profile");
      } else {
        message.error(result?.message || "Login failed. Please try again.", 3);
      }
    } catch (err) {
      console.error("Login failed:", err);
      message.error(err?.message || "Login failed. Please try again.", 3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <img src={logo} alt="Company Logo" className="login-logo" />
            <Title level={4} style={{ margin: "10px 0 0 0", color: "var(--text-color)" }}>
              Motorola Solutions India Pvt. Ltd.
            </Title>
            <Text type="secondary" style={{ color: "var(--text-color)" }}>
              Warehouse Management System
            </Text>
          </div>

          <form onSubmit={handleFormSubmit} className="login-form" aria-label="Login form">
            <label className="visually-hidden" htmlFor="login-email">Email</label>
            <Input
              id="login-email"
              size="large"
              placeholder="Email"
              prefix={<UserOutlined />}
              value={loginDetails.email}
              onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
              style={{ marginBottom: "12px" }}
              autoComplete="username"
              aria-required="true"
            />

            <label className="visually-hidden" htmlFor="login-password">Password</label>
            <Input.Password
              id="login-password"
              size="large"
              placeholder="Password"
              prefix={<LockOutlined />}
              value={loginDetails.password}
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
              style={{ marginBottom: "12px" }}
              autoComplete="current-password"
              aria-required="true"
            />

            {/* Service selection */}
            <div style={{ marginBottom: 12 }} ref={radioWrapperRef} aria-label="Select service">
              <label style={{ display: "block", marginBottom: 6, color: "var(--text-color)" }}>
                Sign in to:
              </label>
              <Radio.Group onChange={(e) => setService(e.target.value)} value={service}>
                <Space direction="horizontal">
                  <Radio value="warehouse">Warehouse</Radio>
                  <Radio value="rma">RMA</Radio>
                </Space>
              </Radio.Group>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="login-btn"
              loading={loading}
              aria-label="Login"
            >
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>

          <div className="back-home" style={{ marginTop: 12 }}>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </Card>
      </div>

      <Footer />
    </>
  );
}

export default LoginForm;
