import React from "react";
import "./AddItem.css";
// 1. Import AutoComplete
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Card,
  AutoComplete, // <-- ADDED
} from "antd";
import { useState, useEffect } from "react";
import GetRegionAPI from "../../API/Region/GetRegion/GetRegionAPI";
import GetKeywordAPI from "../../API/Keyword/GetKeyword/GetKeywordAPI";
import GetSubKeywordAPI from "../../API/Keyword/SubKeyword/GetSubKeyword/GetSubKeywordAPI";
import GetItemAvailabilityStatusOptionAPI from "../../API/StatusOptions/ItemAvailabilityStatusOption/GetItemAvailabilityStatusOptionAPI";
import GetItemStatusOptionAPI from "../../API/StatusOptions/ItemStatusOption/GetItemStatusOptionAPI";
import AddItemAPI from "../../API/ItemRelatedApi/AddItem/AddItemAPI";

function AddItem() {
  const [form] = Form.useForm();
  const role = localStorage.getItem("_User_role_for_MSIPL");
  const [regions, setRegions] = useState();
  const [keywords, setKeywords] = useState();
  const [subkeywords, setSubKeywords] = useState();
  const [itemAvailabilityOption, setItemAvailabilityOption] = useState();
  const [itemStatusOption, setItemStatusOption] = useState();
  const [keywordSelection, setKeywordSelection] = useState({
    keywordName: "",
  });

  // --- Defined the options for the new dropdown ---
  const systemNameOptions = ["ASTRO", "TETRA", "ASTRO/TETRA"];
  const moduleForOptions = ["CONSOLE", "RADIO", "SERVER", "RCW"];

  // 2. Format options for AutoComplete (it prefers an array of { value: 'text' } objects)
  const systemOptionsForAutoComplete = systemNameOptions.map((opt) => ({
    value: opt,
  }));
  const moduleOptionsForAutoComplete = moduleForOptions.map((opt) => ({
    value: opt,
  }));

  // API calls for fetching options
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          regionsData,
          keywordsData,
          availabilityData,
          statusData,
        ] = await Promise.all([
          GetRegionAPI(),
          GetKeywordAPI(),
          GetItemAvailabilityStatusOptionAPI(),
          GetItemStatusOptionAPI(),
        ]);

        if (regionsData) setRegions(regionsData);
        if (keywordsData) setKeywords(keywordsData);
        if (availabilityData) setItemAvailabilityOption(availabilityData);
        if (statusData) setItemStatusOption(statusData);
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
    };
    fetchAllData();
  }, []);

  // API call for sub-keywords based on keyword selection
  useEffect(() => {
    const fetchSubKeyword = async (keywordName) => {
      try {
        const data = await GetSubKeywordAPI(keywordName);
        if (data && data.subKeywordList) {
          const subKeywordValues = data.subKeywordList.map(
            (item) => item.subKeyword
          );
          setSubKeywords(subKeywordValues);
        } else {
          setSubKeywords(null);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    if (keywordSelection.keywordName) {
      fetchSubKeyword(keywordSelection.keywordName);
    }
  }, [keywordSelection.keywordName]);

  const handleKeywordChange = (selectedKeyword) => {
    setKeywordSelection({
      ...keywordSelection,
      keywordName: selectedKeyword,
    });
    form.setFieldsValue({ subKeyword: null });
  };

  const onFinish = async (values) => {
    console.log("Form values:", values);
    await AddItemAPI(values);
  };

  return (
    <>
      <title>Add New Item</title>
      <Card title="Add New Item">
        <Form
          form={form}
          name="spare-part-form"
          onFinish={onFinish}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Serial No."
                name="serialNo"
                rules={[
                  { required: true, message: "Please enter the serial number!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Part No." name="partNo">
                <Input />
              </Form.Item>
              <Form.Item
                label="Rack No."
                name="rackNo"
                rules={[
                  { required: true, message: "Please enter the rack number!" },
                ]}
              >
                <Input />
              </Form.Item>

              {/* 3. Replaced Select with AutoComplete for 'system' */}
              <Form.Item label="System Name" name="system">
                <AutoComplete
                  options={systemOptionsForAutoComplete}
                  placeholder="Select or type a system"
                  allowClear
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              </Form.Item>

              <Form.Item label="Module Version" name="systemVersion">
                <Input />
              </Form.Item>

              {/*add search functionlity on input field */}

              {subkeywords && (
                <Form.Item label="Sub Keyword" name="subKeyword">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select subkeyword"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.children ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.children ?? "").toLowerCase())
                    }
                  >
                    {subkeywords.map((subkeyword) => (
                      <Select.Option key={subkeyword} value={subkeyword}>
                        {subkeyword}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label="Availability"
                name="availableStatus"
                rules={[
                  {
                    required: true,
                    message: "Please select Availability Status!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Availibility"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                >
                  {itemAvailabilityOption?.map((itemAvailStatus) => (
                    <Select.Option key={itemAvailStatus} value={itemAvailStatus}>
                      {itemAvailStatus}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {role === "admin" && (
                <Form.Item
                  label="Region"
                  name="region"
                  rules={[
                    { required: true, message: "Please select a region!" },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select a region"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.children ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.children ?? "").toLowerCase())
                    }
                  >
                    {regions?.map((region) => (
                      <Select.Option key={region} value={region}>
                        {region}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item label="Remark" name="remark">
                <Input.TextArea />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Box No." name="boxNo">
                <Input />
              </Form.Item>
              <Form.Item label="Model No." name="modelNo">
                <Input />
              </Form.Item>
              <Form.Item label="Spare Location" name="spareLocation">
                <Input />
              </Form.Item>

              {/* 4. Replaced Select with AutoComplete for 'moduleFor' */}
              <Form.Item label="Module For" name="moduleFor">
                <AutoComplete
                  options={moduleOptionsForAutoComplete}
                  placeholder="Select or type a module"
                  allowClear
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              </Form.Item>

              <Form.Item
                label="Keyword"
                name="keyword"
                rules={[{ required: true, message: "Please select a keyword!" }]}
              >
                <Select
                  onChange={handleKeywordChange}
                  showSearch
                  allowClear
                  placeholder="Select a keyword"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                >
                  {keywords?.map((keyword) => (
                    <Select.Option key={keyword} value={keyword}>
                      {keyword}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Item Status"
                name="itemStatus"
                rules={[
                  { required: true, message: "Please select the item status!" },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Item status"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                >
                  {itemStatusOption?.map((itemStatus) => (
                    <Select.Option key={itemStatus} value={itemStatus}>
                      {itemStatus}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Party Name" name="partyName">
                <Input />
              </Form.Item>
              <Form.Item label="Item Description" name="itemDescription">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default AddItem;