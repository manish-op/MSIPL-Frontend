// src/Components/RMA/RmaLayout.js
import React, { useState, useContext } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  ToolOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import Header from "../Header/Header"; // Import Global Header
import "./RmaDashboard.css";

const { Sider, Footer, Content } = Layout;
const { confirm } = Modal;

const RmaLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const showLogoutConfirm = () => {
    confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleOutlined />,
      okText: "Logout",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        navigate("/login");
      },
    });
  };

  const location = useLocation();
  let selectedKey = "rma-dashboard";
  if (location.pathname.includes("rma-requests")) selectedKey = "rma-request";
  if (location.pathname.includes("unrepaired")) selectedKey = "unrepaired";
  if (location.pathname.includes("repaired")) selectedKey = "repaired";

  const handleMenuClick = ({ key }) => {
    if (key === "rma-dashboard") navigate("/rma-dashboard");
    if (key === "rma-request") navigate("/rma-requests");
    if (key === "unrepaired") navigate("/unrepaired");
    if (key === "repaired") navigate("/repaired");
    if (key === "logout") showLogoutConfirm();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Global Header */}
      <Header onLogout={showLogoutConfirm} />

      <Layout>
        {/* Sidebar */}
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="msipl-sider"
          theme="dark"
        >
          <div
            className="msipl-sider-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            theme="dark"
            onClick={handleMenuClick}
            items={[
              {
                key: "rma-dashboard",
                icon: <DashboardOutlined />,
                label: "Dashboard",
              },
              {
                key: "rma-request",
                icon: <FileTextOutlined />,
                label: "RMA Requests",
              },
              {
                key: "unrepaired",
                icon: <ToolOutlined />,
                label: "Unrepaired",
              },
              {
                key: "repaired",
                icon: <CheckCircleOutlined />,
                label: "Repaired",
              },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Logout",
                danger: true,
              },
            ]}
          />
        </Sider>

        {/* Main content + footer */}
        <Layout>
          <Content className="msipl-content">{children}</Content>

          <Footer className="msipl-footer">
            <span>Motorola Solutions India Pvt Ltd</span>
            <span>📍 Address: Gurgaon, Haryana, India</span>
            <span>📞 Contact: 01244192000</span>
            <span>About</span>
            <span>Help</span>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default RmaLayout;
