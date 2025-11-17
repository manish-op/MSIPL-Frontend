import { Row, Col, Form, DatePicker, Button, Select } from "antd";
import ItemRepairingStatusAPI from "../API/RepairingOption/ItemRepairingStatusAPI";
import EmployeeAssignItemList from "../FRU/Repairing/EmployeeRepairPageOnProfile/EmployeeAssignItemList";
import EmployeeUpdateAssignTicketDetails from "../FRU/Repairing/EmployeeRepairPageOnProfile/EmployeeUpdateAssignTicketDetails";
import GetListOfAssignItemAPI from "../API/FRU/EmployeeAssignItems/GetListOfAssignItemAPI";
import HomeForAdmin from "./HomeForAdmin";
import "./Profile.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function Profile() {
  const [form] = Form.useForm();
  const role = localStorage.getItem("_User_role_for_MSIPL");
  const [repairingStatus, setRepairingStatus] = useState();
  const [assignTicketDetailList, SetAssignTicketDetailList] = useState(
    JSON.parse(localStorage.getItem("assignTicketDetailList")) || []
  );

  useEffect(() => {
    const fetchRepairingStatus = async () => {
      try {
        const data = await ItemRepairingStatusAPI();
        if (data) {
          setRepairingStatus(data);
        }
      } catch (error) {
        // Handle error gracefully, perhaps set state to null or an empty array
        console.error("Failed to fetch repairing status:", error);
      }
    };
    fetchRepairingStatus();
  }, []);

  const onFinish = async (values) => {
    // Convert dayjs objects to ISO strings or a format your API expects
    const apiValues = {
      ...values,
      startingDate: values.startingDate ? values.startingDate.format('YYYY-MM-DD') : undefined,
      endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
    };
    await GetListOfAssignItemAPI(apiValues, SetAssignTicketDetailList);
  };

  return (
    <>
      {role !== "admin" ? (
        <div className="profile-container">
          <div className="header-info">
            <span>
              <strong>Name : </strong>
              {localStorage.getItem("name")}
            </span>
            <span>
              <strong>Email : </strong> {localStorage.getItem("email")}
            </span>
            <span>
              <strong>Mobile No : </strong> {localStorage.getItem("mobile")}
            </span>
            <span>
              <strong>Role : </strong>{" "}
              {localStorage.getItem("_User_role_for_MSIPL")}
            </span>
            {localStorage.getItem("_User_role_for_MSIPL") !== "admin" && (
              <span>
                <strong>Region : </strong> {localStorage.getItem("region")}
              </span>
            )}
          </div>

          <div className="search-form-container">
            <Form
              className="search-form"
              form={form}
              name="TicketDetailSEO"
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col>
                  <Form.Item
                    label="FROM: "
                    name="startingDate"
                    rules={[{ required: true, message: 'Please select a start date!' }]}
                  >
                    <DatePicker
                      size="middle"
                      style={{ width: 130 }}
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label="TO: "
                    name="endDate"
                    rules={[{ required: false }]}
                  >
                    <DatePicker
                      size="middle"
                      style={{ width: 130 }}
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
                
                <Col>
                  <Form.Item
                    label="Repair Status"
                    name="repairStatus"
                    rules={[{ required: false }]}
                  >
                    <Select
                      size="middle"
                      style={{ minWidth: "150px" }}
                    >
                      <Select.Option key="select" value={""}>
                        Select
                      </Select.Option>
                      {repairingStatus?.map((repairStatusName) => (
                        <Select.Option
                          key={repairStatusName}
                          value={repairStatusName}
                        >
                          {repairStatusName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="middle"
                      className="primary-btn"
                    >
                      Search
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="main-content">
            <div className="item-list-container">
              {EmployeeAssignItemList(assignTicketDetailList)}
            </div>
            <div className="update-details-container">
              {EmployeeUpdateAssignTicketDetails()}
            </div>
          </div>
        </div>
      ) : (
        <HomeForAdmin />
      )}
    </>
  );
}

export default Profile;