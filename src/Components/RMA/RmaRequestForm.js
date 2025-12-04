// src/Components/RMA/RmaRequestForm.js
import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Row,
  Col,
  Typography,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import RmaLayout from "./RmaLayout";
import "./RmaRequestForm.css";

import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

function RmaRequestForm() {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const navigate = useNavigate();

  const handleGenerateForm = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare formData with defaults for missing fields
      const formData = {
        ...values,
        date: new Date().toISOString().split('T')[0], // Current date
        dplLicense: values.dplLicense || "",
        modeOfTransport: values.modeOfTransport || "",
        shippingMethod: values.shippingMethod || "",
        courierCompanyName: values.courierCompanyName || "",
        signature: values.signature || ""
      };

      // Transform items array for RepairRequestForm
      const items = (values.items || []).map(item => ({
        product: item.product || "",
        model: item.partNo || "",
        serialNo: item.serialNo || "",
        rmaNo: item.rmaNo || "",
        faultDescription: item.faultDescription || "",
        codeplug: item.codeplugProgramming || "",
        flashCode: "", 
        status: item.status || "",
        invoiceNo: item.invoiceNo || "",
        dateCode: "", 
        fmUlatex: item.fmUlAtex || "",
        encryption: item.encryption || "",
        firmwareVersion: item.firmwareVersion || "",
        lowerFirmwareVersion: item.lowerFirmwareVersion || "",
        remarks: item.remarks || ""
      }));
      
      navigate("/rma-generate-form", { state: { formData, items } });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Open preview popup
  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      setPreviewData(values);
      setPreviewVisible(true);
    } catch {
      // validation errors are shown by antd
    }
  };


  // Called when user clicks "Submit" (in preview modal)
  const handleSubmit = async () => {
    // Reuse handleGenerateForm logic to navigate
    await handleGenerateForm();
    setPreviewVisible(false);
  };

  return (
    <RmaLayout>
      <div className="rma-form-card">
        <Title level={3} className="rma-form-title">
          RMA Repair Request Form
        </Title>

        <Form form={form} layout="vertical" colon={false}>
          {/* SHIPMENT DETAILS */}
          <Title level={4} className="rma-section-title">
            Shipment Details
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="DPL License"
                name="dplLicense"
              >
                <Input placeholder="Enter DPL License" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mode Of Transport *"
                name="modeOfTransport"
                rules={[{ required: true, message: "Mode Of Transport is required" }]}
              >
                <Input placeholder="Enter Mode Of Transport" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Returning Shipment Shipping Method *"
                name="shippingMethod"
                rules={[{ required: true, message: "Shipping Method is required" }]}
              >
                <Select placeholder="Select Shipping Method">
                  <Option value="Motorola Courier Service">Motorola Courier Service</Option>
                  <Option value="Other Courier Service">Other Courier Service</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.shippingMethod !== currentValues.shippingMethod}
              >
                {({ getFieldValue }) => (
                  <Form.Item
                    label="Courier Company Name (if other) *"
                    name="courierCompanyName"
                    rules={[
                      {
                        required: getFieldValue("shippingMethod") === "Other Courier Service",
                        message: "Courier Company Name is required",
                      },
                    ]}
                  >
                    <Input 
                      placeholder="Enter Courier Company Name" 
                      disabled={getFieldValue("shippingMethod") !== "Other Courier Service"}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* RETURN ADDRESS DETAILS */}
          <Title level={4} className="rma-section-title">
            Return Address Details
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Company Name *"
                name="companyName"
                rules={[{ required: true, message: "Company Name is required" }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email Address *"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Contact Name *"
                name="contactName"
                rules={[{ required: true, message: "Contact Name is required" }]}
              >
                <Input placeholder="Enter contact name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Telephone Number *"
                name="telephone"
                rules={[{ required: true, message: "Telephone is required" }]}
              >
                <Input placeholder="Enter telephone number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Mobile Number *"
                name="mobile"
                rules={[{ required: true, message: "Mobile is required" }]}
              >
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Return Address *"
            name="returnAddress"
            rules={[{ required: true, message: "Return Address is required" }]}
          >
            <TextArea rows={3} placeholder="Enter full return address" />
          </Form.Item>

          {/* INVOICE ADDRESS DETAILS */}
          <Title level={4} className="rma-section-title">
            Invoice Address Details (if different)
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Company Name *" name="invoiceCompanyName">
                <Input placeholder="Enter invoice company name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Email Address *" name="invoiceEmail">
                <Input placeholder="Enter invoice email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item label="Contact Name *" name="invoiceContactName">
                <Input placeholder="Enter contact name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Telephone Number *" name="invoiceTelephone">
                <Input placeholder="Enter telephone number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Mobile Number *" name="invoiceMobile">
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Invoice Address *" name="invoiceAddress">
            <TextArea rows={3} placeholder="Enter invoice address" />
          </Form.Item>

          {/* FAULT DETAILS */}
          <Title level={4} className="rma-section-title">
            Fault Details (Fields with * are mandatory)
          </Title>

          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} style={{ marginBottom: 24, border: "1px solid #d9d9d9", padding: 16, borderRadius: 8, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <Text strong>Item {index + 1}</Text>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red", fontSize: 20, cursor: "pointer" }} />
                      )}
                    </div>

                    <Row gutter={16}>
                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          label="Product *"
                          name={[name, "product"]}
                          rules={[{ required: true, message: "Product is required" }]}
                        >
                          <Input placeholder="PRODUCT" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          label="Model No. / Part No. *"
                          name={[name, "partNo"]}
                          rules={[{ required: true, message: "Model/Part No. is required" }]}
                        >
                          <Input placeholder="MODEL / PART NO." />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          label="Serial No. *"
                          name={[name, "serialNo"]}
                          rules={[{ required: true, message: "Serial No. is required" }]}
                        >
                          <Input placeholder="SERIAL NO." />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          label="RMA No."
                          name={[name, "rmaNo"]}
                        >
                          <Input placeholder="RMA No. (if available)" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      {...restField}
                      label="Fault Description *"
                      name={[name, "faultDescription"]}
                      rules={[{ required: true, message: "Fault Description is required" }]}
                    >
                      <TextArea rows={3} placeholder="Describe the fault / issue as clearly as possible" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Codeplug Programming *"
                          name={[name, "codeplugProgramming"]}
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select placeholder="Select option">
                            <Option value="Default">Default</Option>
                            <Option value="Customer Codeplug">Customer Codeplug</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Status (WARR/OOW/AMC/SFS)"
                          name={[name, "status"]}
                        >
                          <Input placeholder="e.g. WARR, OOW, AMC, SFS" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Invoice No. (Accessory)"
                          name={[name, "invoiceNo"]}
                        >
                          <Input placeholder="Invoice No. for accessory" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="FM / UL / ATEX *"
                          name={[name, "fmUlAtex"]}
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select placeholder="Select option">
                            <Option value="N">N - Non FM/UL/ATEX</Option>
                            <Option value="Y-FM-no-label">Y - FM, repair & return (no FM label)</Option>
                            <Option value="Y-FM-unrepaired">Y - FM, return unrepaired</Option>
                            <Option value="Y-UL">Y - UL</Option>
                            <Option value="Y-ATEX">Y - ATEX</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Encryption *"
                          name={[name, "encryption"]}
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Input placeholder="e.g. Tetra, Astro, None" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Firmware Version *"
                          name={[name, "firmwareVersion"]}
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Input placeholder="Enter firmware version" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Lower Firmware Version *"
                          name={[name, "lowerFirmwareVersion"]}
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select placeholder="Select option">
                            <Option value="Follow Depot Mainboard Inventory Version">Follow Depot Mainboard Inventory Version</Option>
                            <Option value="Return unrepaired">Return unrepaired</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Remarks"
                          name={[name, "remarks"]}
                        >
                          <TextArea rows={2} placeholder="Any additional remarks" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            label="Print Name (Authorised Signature)"
            name="signature"
            rules={[{ required: true, message: "Signature Name is required" }]}
            style={{ marginTop: 24 }}
          >
            <Input placeholder="Enter name for authorised signature" />
          </Form.Item>

          <div className="rma-actions">
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Button type="default" onClick={handlePreview}>
              Preview
            </Button>
            <Button type="primary" onClick={handleGenerateForm} style={{ marginLeft: 8, backgroundColor: "#52c41a", borderColor: "#52c41a" }}>
              Generate Form
            </Button>
          </div>
        </Form>
      </div>

      {/* PREVIEW CUSTOM POPUP */}
      {previewVisible && (
        <div className="modal-backdrop">
          <div className="modal-popup" style={{ minWidth: 600, textAlign: "left" }}>
            <h3>RMA Request Preview</h3>
            
            {previewData && (
              <div style={{ maxHeight: "60vh", overflowY: "auto", marginBottom: 20, paddingRight: 10 }}>
                <Title level={5}>Return Address Details</Title>
                <p><Text strong>Company:</Text> {previewData.companyName}</p>
                <p><Text strong>Contact:</Text> {previewData.contactName}</p>
                <p><Text strong>Email:</Text> {previewData.email}</p>
                <p><Text strong>Telephone:</Text> {previewData.telephone}</p>
                <p><Text strong>Mobile:</Text> {previewData.mobile}</p>
                <p><Text strong>Return Address:</Text> {previewData.returnAddress}</p>

                <Title level={5} style={{ marginTop: 16 }}>Items ({previewData.items?.length || 0})</Title>
                {(previewData.items || []).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: 10, borderBottom: "1px solid #eee", paddingBottom: 10 }}>
                    <Text strong>Item {idx + 1}:</Text> {item.product} - {item.partNo} (SN: {item.serialNo})
                    <br />
                    <Text type="secondary">Fault: {item.faultDescription}</Text>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <button 
                className="close-modal-btn" 
                style={{ backgroundColor: "#888" }}
                onClick={() => setPreviewVisible(false)}
              >
                Cancel
              </button>
              <button 
                className="close-modal-btn" 
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </RmaLayout>
  );
}

export default RmaRequestForm;
