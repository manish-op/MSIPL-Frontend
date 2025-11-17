import React, { useState } from "react";
import { Menu, Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { RiMenu3Line,RiMenuFold4Line  } from "react-icons/ri";
import "./Sidebar.css"
const { Sider } = Layout;

function Sidebar() {
  const role = localStorage.getItem("_User_role_for_MSIPL");
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(["profile"]);
  const [collapsed, setCollapsed] = useState(false);

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys(keys.length > 0 ? [keys[keys.length - 1]] : []);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    
    <div style={{ position: "relative", minHeight: "100vh" }}>
    
      <Sider
        width={250}
        style={{ height: '100vh' }}
        theme="dark"
        className="custom-sidebar"
        collapsible
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth="0"
      >
        
        <div style={{ padding: "10px", textAlign: "right" }}>
          {!collapsed && (
            <Button
              type="text"
              onClick={toggleSidebar}
              style={{ color: "white" }}
              icon={<RiMenu3Line />}
            />
          )}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          onClick={(item) => navigate(item.key)}
          // Hiding the menu when collapsed prevents potential visual glitches
          style={{ display: collapsed ? 'none' : 'block' }}
          items={[
            {
              label: "Dashboard",
              key: "dashboard",
              children: [
                { label: "Profile", key: "profile" },
                { label: "Changed Password", key: "changePassword" },
              ],
            },
            (role === "admin" || role === "manager") && {
              label: "Employee Management",
              key: "employee",
              children: [
                { label: "Add Employee", key: "addEmployee" },
                role === "admin" && {
                  label: "Change Employee Role",
                  key: "changEmployeeRole",
                },
                role === "admin" && {
                  label: "Change Employee Region",
                  key: "changEmployeeRegion",
                },
                { label: "Change Employee Password", key: "changEmployeePass" },
              ].filter(Boolean),
            },
            role === "admin" && {
              label: "Keyword Management",
              key: "keyword",
              children: [
                { label: "Add Keyword", key: "addKeyword" },
                { label: "Update Keyword", key: "updateKeyword" },
                { label: "Add SubKeyword", key: "addSubKeyword" },
                { label: "Update SubKeyword", key: "updateSubKeyword" },
              ],
            },
            role === "admin" && {
              label: "Region Management",
              key: "region",
              children: [
                { label: "Add Region", key: "addNewRegion" },
                { label: "Update Region", key: "updateRegion" },
              ],
            },
            {
              label: "Item Management",
              key: "item",
              children: [
                (role === "admin" || role === "manager") && {
                  label: "Add Item",
                  key: "addItem",
                },
                { label: "Search By Keyword", key: "getItemByKeyword" },
                { label: "Search By SerialNo", key: "getItemBySerial" },
                { label: "History By SerialNo", key: "itemHistory" },
              ].filter(Boolean),
            },
            // (role === "admin" || role === "manager") && {
            //   label: "Tickets",
            //   key: "tickets",
            //   children: [
            //     { label: "Ticket Dashboard", key: "tickedDashboard" },
            //   ],
            // },
            {
              label: "GatePass",
              key: "gatepass",
              children: [
                { label: "Inward Gatepass", key: "inwardGatePass" },
                { label: "Outward Gatepass", key: "outwardGatePass" },
              ],
            },
            (role === "admin") && {
              label: "Option",
              children: [
                { label: "Add Availability Option", key: "addAvailStatus" },
                { label: "Update Availability Option", key: "updateAvailStatus" },
                { label: "Add Item Status Option", key: "addItemStatus" },
                { label: "Update Item Status Option", key: "UpdateItemStatus" },
              ],
            },
            {
              label: "Import / Export",
              key: "import_export",
              children: [
                (role === "admin" || role === "manager") && {
                  label: "Import/Export CSV",
                  key: "import_export_CSV",
                },
              ].filter(Boolean),
            },
             (role === "admin" || role === "manager") &&  {
              label: "Activity Logs",
              children: [
                { label: "Activity Logs", key: "activity-logs" },
                { label: "Users List", key: "all-users" },
              ],
            },

            (role === "admin" || role === "manager") &&  {
              label: "Add Threshold",
              children: [
                { label: "Add Threshold", key: "thresholds" },
                { label: "Alerts", key: "alerts/active" },
              ],
            },
            {
              label: "Logout",
              key: "logout",
            },
          ].filter(Boolean)}
        />
      </Sider>

     
      {collapsed && (
        <Button
          type="primary" 
          onClick={toggleSidebar}
          icon={<RiMenuFold4Line />}
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            zIndex: 1000,
          }}
        />
      )}
    
    </div>
  );
}

export default Sidebar;