import React, { useState } from "react";
import { useEffect } from "react";
import { Form, Input, Button, Row, Col, Card, message } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useItemDetails } from "../UpdateItem/ItemContext";
import { URL } from "../../API/URL";

function CheckItemSearchBySerialNo() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setItemDetails } = useItemDetails();
  const token = atob(Cookies.get("authToken"));

  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    if (itemData) {
      navigate("/dashboard/updateItem");
    }
  }, [itemData, navigate]);

  //api calling to get item details for update item details
  const onFinish = async (values) => {
    if (token === null || token === undefined) {
      navigate("/login");
    }
    await fetch(URL + "/componentDetails/serialno", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: values.serialNo,
    })
      .then(async (response) => {
        if (!response.ok) {
          const mess = await response.text();
          if (response.status === 404) {
            //setItemDetails(null);
            console.log(mess);
            return message.warning(mess, 2);
          } else if (response.status === 403) {
            //setItemDetails(null);
            return message.warning(mess, 2);
          } else {
            //setItemDetails(null);
            return message.warning(mess, 2);
          }
        } else {
          const data = await response.json();
          setItemData(data);
          setItemDetails(data);
          //return alert("item fetch successfully");
          return;
        }
      })
      .catch((error) => {
        message.error("An error occurred.");
      });
  };

  return (
    <>
      <title>SearchBySerialno</title>
      <div
        style={{
          display: "flex",
          flex: "1",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card>
          <h2
            style={{
              fontSize: "20px",
              color: "orange",
              textAlign: "center",
              padding: "2px",
              marginBottom: "20px",
            }}
          >
            Search by Serial no.
          </h2>
          <Form
            form={form}
            name="check-item-form"
            onFinish={onFinish}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Serial No."
                  name="serialNo"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the serial number!",
                    },
                  ]}
                  htmlFor="serialNoInput"
                >
                  <Input id="serialNoInput"  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search Item
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default CheckItemSearchBySerialNo;
