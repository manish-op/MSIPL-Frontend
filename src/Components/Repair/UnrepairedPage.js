import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Drawer,
    Form,
    Input,
    Select,
    message,
    Typography,
} from "antd";
import {
    getUnrepairedTickets,
    assignEngineer,
    updateTicket,
    checkPart,
    createPartRequest
} from "../API/Repair/RepairApi";
import RmaLayout from "../RMA/RmaLayout";
import "../RMA/RmaDashboard.css";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

export default function UnrepairedPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [form] = Form.useForm();

    async function loadTickets() {
        setLoading(true);
        try {
            const data = await getUnrepairedTickets();
            setTickets(data);
        } catch (e) {
            console.error(e);
            message.error("Failed to load unrepaired devices");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTickets();
    }, []);

    const columns = [
        { title: "Serial No.", dataIndex: "serialNo" },
        { title: "Product", dataIndex: "product" },
        {
            title: "Fault",
            dataIndex: "faultDescription",
            ellipsis: true,
        },
        { title: "Engineer", dataIndex: "assignedEngineerName" },
        { title: "Status", dataIndex: "status" },
        {
            title: "Actions", render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        setCurrentTicket(record);
                        form.setFieldValue({
                            engineerId: record.assignedEngineerId,
                            faultRemarks: record.faultRemarks,
                            partNo: "",
                            qty: 1,
                        });
                        setDrawerOpen(true);
                    }}
                >
                    View/Assign
                </Button>
            ),
        },
    ];

    async function handleSave(values) {
        if (!currentTicket) return;
        try {
            await assignEngineer(currentTicket.id, values.engineerId);
            await updateTicket(currentTicket.id, {
                faultRemarks: values.faultRemarks,
            });
            message.success("Ticket Updated Successfully");
            setDrawerOpen(false);
            loadTickets();
        } catch (e) {
            console.error(e);
            message.error("Failed to Update Ticket");
        }
    }

    async function handleCheckPart(partNo) {
        if (!partNo) {
            message.warning("Enter part number first");
            return;
        }
        try {
            const res = await checkPart(partNo);
            if (res.available) {
                message.success(`In Stock: ${res.qty} pcs`);
            } else {
                message.warning("Not in stock, Purchase Order(PO) will be required");
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to check inventory");
        }
    }

    async function handleRequestPart() {
        if (!currentTicket) return;
        const { partNo, qty } = form.getFieldValue(["partNo", "qty"]);
        if (!partNo || !qty) {
            message.warning("Enter part number and quantity");
            return;
        }
        try {
            const res = await checkPart(partNo);
            const source = res.available ? "INVENTORY" : "PURCHASE_ORDER";
            await createPartRequest(currentTicket.id, { partNo, qty, source });
            message.success(
                source === "INVENTORY"
                    ? "Reserved from Inventory"
                    : "Purchase Order(PO) request created(5 days timeline)"
            );
            loadTickets();
        } catch (e) {
            console.error(e);
            message.error("Failed to request part");
        }
    }

    return (
        <RmaLayout>
            <div style={{ padding: "24px", background: "transparent" }}>
                <div style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                    <Title level={3} style={{ marginBottom: "20px", color: "#1890ff" }}>Unrepaired Devices</Title>
                    <Table
                        rowKey="id"
                        loading={loading}
                        columns={columns}
                        dataSource={tickets}
                        pagination={{ pageSize: 10 }}
                    />
                </div>

                <Drawer
                    title={
                        currentTicket
                            ? `Ticket #${currentTicket.id} - ${currentTicket.serialNo}`
                            : "Ticket"
                    }
                    width={450}
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    styles={{ body: { paddingBottom: 80 } }}
                >
                    {currentTicket && (
                        <>
                            <div style={{ marginBottom: 24, padding: 16, background: "#f5f5f5", borderRadius: 4 }}>
                                <p style={{ marginBottom: 8 }}><strong>Product:</strong> {currentTicket.product}</p>
                                <p style={{ marginBottom: 0 }}><strong>Fault:</strong> {currentTicket.faultDescription}</p>
                            </div>

                            <Form layout="vertical" form={form} onFinish={handleSave}>
                                <Form.Item
                                    label="Assign Engineer"
                                    name="engineerId"
                                    rules={[{ required: true, message: "Select Engineer" }]}>
                                    <Select placeholder="Select Engineer">
                                        <Option value="eng1">Engineer 1</Option>
                                        <Option value="eng2">Engineer 2</Option>
                                        <Option value="eng3">Engineer 3</Option>
                                        <Option value="eng4">Engineer 4</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Fault Remarks"
                                    name="faultRemarks">
                                    <TextArea rows={3} placeholder="Enter remarks..." />
                                </Form.Item>

                                <div style={{ borderTop: "1px solid #eee", margin: "24px 0" }}></div>
                                <Title level={5}>Part Request</Title>

                                <Form.Item
                                    label="Part Number"
                                    name="partNo">
                                    <Input.Search
                                        placeholder="Enter Part Number"
                                        enterButton="Check Stock"
                                        onSearch={handleCheckPart}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Quantity"
                                    name="qty"
                                    initialValue={1}>
                                    <Input type="number" min={1} />
                                </Form.Item>

                                <Button
                                    type="dashed"
                                    block
                                    onClick={handleRequestPart}
                                    style={{ marginBottom: 24 }}
                                >
                                    Request Part (Inventory / PO)
                                </Button>

                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    width: '100%',
                                    borderTop: '1px solid #e9e9e9',
                                    padding: '10px 16px',
                                    background: '#fff',
                                    textAlign: 'right',
                                    zIndex: 1,
                                }}>
                                    <Button onClick={() => setDrawerOpen(false)} style={{ marginRight: 8 }}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Save & Assign
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Drawer>
            </div>
        </RmaLayout>
    );
}