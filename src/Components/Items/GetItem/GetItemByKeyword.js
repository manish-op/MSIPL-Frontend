import {
  Form,
  Select,
  Button,
  Input,
  message,
  Card,
  Row,
  Col,
  Table,
  Space,
  Typography,
} from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { SearchOutlined, PrinterOutlined } from "@ant-design/icons"; // Import icons
import GetRegionAPI from "../../API/Region/GetRegion/GetRegionAPI";
import GetKeywordAPI from "../../API/Keyword/GetKeyword/GetKeywordAPI";
import GetSubKeywordAPI from "../../API/Keyword/SubKeyword/GetSubKeyword/GetSubKeywordAPI";
import GetItemStatusOptionAPI from "../../API/StatusOptions/ItemStatusOption/GetItemStatusOptionAPI";
import GetItemAvailabilityStatusOptionAPI from "../../API/StatusOptions/ItemAvailabilityStatusOption/GetItemAvailabilityStatusOptionAPI";
import GetItemHistoryBySerialNoAPI from "../../API/ItemRelatedApi/ItemHistory/GetItemHistoryBySerialNoAPI";
import { useItemDetails } from "../UpdateItem/ItemContext";
import UtcToISO from "../../UtcToISO";
import { URL } from "../../API/URL";

import "./GetItemByKeyword.css";
import "./PrintTable.css";

const { Title } = Typography;
const { Option } = Select;

function GetItemByKeyword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = atob(Cookies.get("authToken") || "");
  const role = localStorage.getItem("_User_role_for_MSIPL");
  const { setItemHistory, setItemDetails } = useItemDetails();

  // --- State Management ---
  const [regions, setRegions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [subkeywords, setSubKeywords] = useState([]);
  const [itemAvailabilityOptions, setItemAvailabilityOptions] = useState([]);
  const [itemStatusOptions, setItemStatusOptions] = useState([]);
  const [itemsDetailsFromDb, setItemsDetailsFromDb] = useState([]);
  const [loading, setLoading] = useState(false); // For loading states

  // --- Data Fetching with useEffect ---
  useEffect(() => {
    // Consolidated fetch function for dropdown options
    const fetchOptions = async () => {
      setRegions(await GetRegionAPI());
      setKeywords(await GetKeywordAPI());
      setItemAvailabilityOptions(await GetItemAvailabilityStatusOptionAPI());
      setItemStatusOptions(await GetItemStatusOptionAPI());
    };
    fetchOptions();
  }, []);

  const handleKeywordChange = async (selectedKeyword) => {
    form.setFieldsValue({ subKeyword: null }); // Reset sub-keyword field
    if (selectedKeyword) {
      try {
        const data = await GetSubKeywordAPI(selectedKeyword);
        if (data && data.subKeywordList) {
          const subKeywordValues = data.subKeywordList.map(
            (item) => item.subKeyword
          );
          setSubKeywords(subKeywordValues);
        } else {
          setSubKeywords([]);
        }
      } catch (error) {
        console.error("Failed to fetch sub-keywords:", error);
        setSubKeywords([]);
      }
    } else {
      setSubKeywords([]); // Clear sub-keywords if no keyword is selected
    }
  };

  // --- Event Handlers ---
  const onFinish = async (values) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setItemsDetailsFromDb([]); // Clear previous results

    try {
      const response = await fetch(`${URL}/componentDetails/keyword`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseText = await response.text();
      if (!response.ok) {
        message.warning(responseText || "An error occurred.", 3);
      } else {
        const data = JSON.parse(responseText);
        setItemsDetailsFromDb(data);
        if (data.length === 0) {
          message.info("No items found matching your criteria.");
        }
      }
    } catch (error) {
      message.error(`API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = async (serialNo) => {
    // This logic is simplified for clarity, assuming the original works for you
    // But a more robust fetch wrapper would be better
    try {
      const response = await fetch(`${URL}/componentDetails/serialno`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: serialNo,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setItemDetails(data);
      navigate("/dashboard/updateItem");
    } catch (error) {
      message.error(`Failed to fetch item details: ${error.message}`);
    }
  };

  const handleHistoryClick = (serialNo) => {
    GetItemHistoryBySerialNoAPI({ serialNo }, setItemHistory, navigate);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Table Column Definitions ---
  const tableColumns = [
    { title: "Serial No", dataIndex: "serial_No", key: "serial_No", fixed: 'left', width: 120 },
    { title: "Part No", dataIndex: "partNo", key: "partNo", width: 120 },
    { title: "Keyword", dataIndex: ["keywordEntity", "keywordName"], key: "keyword", width: 150 },
    { title: "Sub Keyword", dataIndex: ["subKeyWordEntity", "subKeyword"], key: "subKeyword", width: 150 },
    { title: "Item Status", dataIndex: ["itemStatusId", "itemStatus"], key: "itemStatus", width: 120 },
    { title: "Available Status", dataIndex: ["availableStatusId", "itemAvailableOption"], key: "availableStatus", width: 150 },
    { title: "System Name", dataIndex: "system", key: "system", width: 150 },
    { title: "Rack No", dataIndex: "rack_No", key: "rack_No", width: 100 },
    { title: "Box No", dataIndex: "boxNo", key: "boxNo", width: 100 },
    { title: "Last Updated By", dataIndex: "empEmail", key: "empEmail", width: 200 },
    {
      title: "Last Updated Date",
      dataIndex: "update_Date",
      key: "update_Date",
      render: (date) => (date ? UtcToISO(date) : "N/A"),
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      fixed: 'right',
      className: 'print-hide',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleUpdateClick(record.serial_No)}>Update</Button>
          <Button onClick={() => handleHistoryClick(record.serial_No)}>History</Button>
        </Space>
      ),
    },
  ];

  return (

    <div className="main-content">
      <div className="search-item-container">
        <Card className="search-card" title="Search Item by Parameters">
          <Form form={form} name="search-by-keyword-form" onFinish={onFinish} layout="vertical">
            <Row gutter={24}>
              {role === "admin" && (
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="Region" name="region" rules={[{ required: true, message: "Please select a region!" }]}>
                    <Select  placeholder="Select Region"   
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
                  }>
                      {regions.map((region) => (<Option key={region} value={region}>{region}</Option>))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Keyword" name="keyword">
                  <Select placeholder="Select Keyword"
                   onChange={handleKeywordChange} showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
                  }>
                    {keywords.map((keyword) => (<Option key={keyword} value={keyword}>{keyword}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Sub Keyword" name="subKeyword">
                  <Select 
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                  placeholder="Select Sub Keyword" disabled={!subkeywords.length} >
                    {subkeywords.map((sub) => (<Option key={sub} value={sub}>{sub}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Part No" name="partNo">
                  <Input placeholder="Enter Part No" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="System Name" name="systemName">
                  <Input placeholder="Enter System Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Available Status" name="itemAvailability">
                  <Select placeholder="Select Availability" showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
                  }>
                    {itemAvailabilityOptions.map((status) => (<Option key={status} value={status}>{status}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Item Status" name="itemStatus">
                  <Select placeholder="Select Status" showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
                  }>
                    {itemStatusOptions.map((status) => (<Option key={status} value={status}>{status}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} style={{ textAlign: "right" }}>
                <Button className="search-button" type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {itemsDetailsFromDb.length > 0 && (
          <Card className="results-card">
            <div className="results-header">
              <Title level={5}>Search Results ({itemsDetailsFromDb.length} items found)</Title>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print Results</Button>
            </div>
            <div  className="printable-area">
              <Table
                columns={tableColumns}
                dataSource={itemsDetailsFromDb}
                rowKey="id"
                loading={loading}
                scroll={{
                  x: "max-content", // // Enables horizontal scrolling for smaller screens
                  y: 600,           
                }}
                pagination={{ pageSize: 10 }}
              />
            </div>
          </Card>
        )}
      </div>

    </div>
  );
}

export default GetItemByKeyword;