import React from "react";
import RmaLayout from "../RMA/RmaLayout";
import { Typography } from "antd";

const { Title } = Typography;

export default function RepairedPage() {
    return (
        <RmaLayout>
            <div style={{ padding: "24px", background: "transparent" }}>
                <div style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    minHeight: "400px"
                }}>
                    <Title level={3} style={{ marginBottom: "20px", color: "#52c41a" }}>Repaired Devices</Title>
                    <p>No repaired devices found.</p>
                </div>
            </div>
        </RmaLayout>
    );
}